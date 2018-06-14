import React from 'react';
import {Modal} from 'react-bootstrap';
import {User, Restaurants} from 'api';
import LaddaButton, {EXPAND_LEFT} from 'react-ladda';
import {Link, browserHistory} from 'react-router';
import { EventEmitter } from 'base/helpers';

let logoDark = require('assets/img/logo-sipboo.png');
let imageNoDish = require('assets/img/no-dish.png');

class Header extends React.Component {
	constructor(props, context) {
    super(props, context);
    this.state = {
    	isLogin: localStorage.getItem('api_token') ? true : false,
    	showLogin: false,
    	showSignup: false,
    	showForgot: false,
    	showChangePass: false,
    	phone: '',
    	password:'',
    	errMsg: '',
			errMsgReg: '',
			successMsgReg: '',
    	userInfo: localStorage.getItem('user_info') ? JSON.parse(localStorage.getItem('user_info')) :  {},
    	loading: false,
    	loadingReg: false,
    	loadingForgot: false,
    	loadingCP: false,
    	fullname: '',
    	phoneReg: '',
    	passwordReg: '',
    	lat: '',
    	lng: '',
    	avatar: '',
    	keySearch: '',
    	phoneForgot: '',
    	forgotMsg: '',
    	changePassMsg: '',
    	changePassErrMsg: '',
    	cpPhone: '',
    	cpCode: '',
			cpPassword: '',
			code: '',
			signupCode: {
				step: 1
			},
			prefixOrder: "ORDERS",
			orders: [],
			totalQuantity: 0
		}

		this.initOrder = this.initOrder.bind(this);
		this.forceOrder = this.forceOrder.bind(this);

	}
	initOrder() {
		this.forceOrder();
	}

	forceOrder() {
		if(this.props.routeName == 'rest_detail') {

			let rest_id = window.location.pathname.replace("/restaurant/","");
			let orderCache = localStorage.getItem(this.state.prefixOrder+"_"+rest_id) ? JSON.parse(localStorage.getItem(this.state.prefixOrder+"_"+rest_id)) : [];
			this.setState({
				orders: orderCache
			})
		}

	}

  componentDidMount() {
  	if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {

      });
    }
    this.forceOrder();

    this.openLoginModalListener = EventEmitter.addListener("OpenLoginModal", () => {
      this.toggleModal('showLogin', true, '');
    })
  }

  componentWillUnmount(){
    this.openLoginModalListener.remove();
  }

  resetForm() {
  	this.setState({
  		phone: '',
    	password:'',
    	errMsg: '',
    	errMsgReg: '',
    	loading: false,
    	loadingReg: false,
    	fullname: '',
    	phoneReg: '',
    	passwordReg: '',
    	phoneForgot: '',
    	forgotMsg: '',
    	changePassMsg: '',
    	changePassErrMsg: '',
    	forgotErrMsg: '',
    	cpPhone: '',
    	cpCode: '',
    	cpPassword: ''
  	});
  }

  toggleModal(name, status, otherName = '') {
  	this.setState({
  		[name]: status
  	});
  	this.resetForm();
  	if (otherName != '') {
  		this.setState({
	  		[otherName]: false
	  	});
  	}
  }

	handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  validateForm() {
  	let pass = true;
  	if (!this.state.phone.trim()) {
  		pass = false;
  		this.setState({errMsg: 'Please enter your phone.'});
  	} else if (!this.state.password) {
  		pass = false;
  		this.setState({errMsg: 'Please enter your password.'});
  	}
  	return pass;
  }

  validateRegForm() {
  	let pass = true;
  	if (!this.state.fullname.trim()) {
  		pass = false;
  		this.setState({errMsgReg: 'Please enter your fullname.'});
  	} else if (!this.state.phoneReg.trim()) {
  		pass = false;
  		this.setState({errMsgReg: 'Please enter your phone.'});
  	} else if (!this.state.passwordReg) {
  		pass = false;
  		this.setState({errMsgReg: 'Please enter your password.'});
  	}
  	return pass;
  }

  handleSubmit() {
  	if (this.validateForm()) {
	  	let params = {
	  		phone: this.state.phone.trim(),
	  		password: this.state.password
	  	}
	  	this.setState({loading: true});
	  	User.actions.login.request(null, params).then(res => {
	  		if (res.data) {
	  			localStorage.setItem('api_token', res.data.data.api_token);
	  			localStorage.setItem('user_info', JSON.stringify(res.data.data));
          EventEmitter.emit("userEvent", {type: "login"});
	  			this.setState({
	  				isLogin: true,
	  				userInfo: res.data.data
	  			});
	  			this.toggleModal('showLogin', false, '');
	  		}
	  		this.setState({loading: false});
	  		this.resetForm();
	  	}).catch( (error) => {
	      this.setState({loading: false});
	      if (error.response && error.response.data) {
	        this.setState({errMsg: error.response.data.message});
	      }
	    });
  	}
  }

  handleLogout() {
  	User.actions.logout.request().then(res => {
  		if (res.data) {
  			localStorage.removeItem('api_token');
  			localStorage.removeItem('user_info');
        EventEmitter.emit("userEvent", {type: "logout"});
  			this.setState({
  				isLogin: false,
  				userInfo: {}
  			});
  		}
  	});
  }

  handleSignup() {
  	if (this.validateRegForm()) {
	  	let params = {
	  		fullname: this.state.fullname.trim(),
	  		phone: this.state.phoneReg.trim(),
	  		password: this.state.passwordReg,
	  		lat: this.state.lat,
	  		lng: this.state.lng
	  	}
			this.setState({loadingReg: true});

			if(this.state.signupCode.step === 1) {
				User.actions.sendCode.request(null, {phone: params.phone}).then(res => {
					this.setState({
						signupCode: {
							step: 2
						},
						loadingReg: false
					}, () => {
						localStorage.setItem('fullname', params.fullname);
						localStorage.setItem('phone', params.phone);
						localStorage.setItem('password', params.password);
						localStorage.setItem('lat', params.lat);
						localStorage.setItem('lng', params.lng);
					});

				}).catch( (error) => {
					this.setState({loadingReg: false});
					if (error.response && error.response.data) {
						this.setState({errMsgReg: error.response.data.message});
					}
				});
			}
			if(this.state.signupCode.step === 2) {
				params = {
					fullname: localStorage.getItem('fullname') || "",
					phone: localStorage.getItem('phone') || "",
					password: localStorage.getItem('password') || "",
					lat: localStorage.getItem('lat') || "",
					lng: localStorage.getItem('lng') || "",
					code: this.state.code
				}
				Restaurants.actions.getCurrentLocation.request(null).then(position => {
					let coordsSignup = position.data.location || {
						lat: 0,
						lng:  0
					}
					params.lat = coordsSignup.lat;
					params.lng = coordsSignup.lng;
					User.actions.signup.request(null, params).then(res => {
						if (res.data) {
							localStorage.setItem('api_token', res.data.data.api_token);
              localStorage.setItem('user_info', JSON.stringify(res.data.data));
              EventEmitter.emit("userEvent", {type: "login"});
							this.setState({
								isLogin: true,
								userInfo: res.data.data
							});
							this.toggleModal('showSignup', false, '');
						}
						localStorage.removeItem('fullname', params.fullname);
						localStorage.removeItem('phone', params.phone);
						localStorage.removeItem('password', params.password);
						localStorage.removeItem('lat', params.lat);
						localStorage.removeItem('lng', params.lng);
						this.setState({loadingReg: false});
						this.resetForm();
					}).catch( (error) => {
						this.setState({loadingReg: false});
						if (error.response && error.response.data) {
							this.setState({errMsgReg: error.response.data.message});
						}
					});
				});
			}

  	}
  }

  handleSearch() {
  	let inputKey = this.state.keySearch ? this.state.keySearch.trim() : '';
  	browserHistory.push(`/rest/search?q=${inputKey}&type=restaurant`);
  }
  clearSearch() {
  	this.setState({keySearch: ''});
  }

  handleForgot() {
  	if (this.state.phoneForgot && this.state.phoneForgot.trim()) {
  		this.setState({loadingForgot: true, forgotMsg: '', forgotErrMsg: ''});
  		User.actions.forgotPassword.request(null, {phone: this.state.phoneForgot.trim() }).then(res => {
  			if (res.data && !res.data.error) {
  				this.setState({
  					forgotMsg: 'An sms has been sent to '+this.state.phoneForgot.trim()+' with code to reset password.'
  				})
  			}
  			this.setState({loadingForgot: false, phoneForgot: ''});
  			setTimeout(()=> {
  				this.toggleModal('showChangePass', true, 'showForgot');
  			}, 2000);
  		}).catch( (error) => {
	      this.setState({loadingForgot: false});
	      if (error.response && error.response.data) {
	        this.setState({forgotErrMsg: error.response.data.message});
	      }
	    });
  	}
  }

  validateCPForm() {
  	let pass = true;
  	if (!this.state.cpPhone.trim()) {
  		pass = false;
  		this.setState({changePassErrMsg: 'Please enter your phone.'});
  	} else if (!this.state.cpCode.trim()) {
  		pass = false;
  		this.setState({changePassErrMsg: 'Please enter your code.'});
  	} else if (!this.state.cpPassword) {
  		pass = false;
  		this.setState({changePassErrMsg: 'Please enter new password.'});
  	}
  	return pass;
  }

  handleChangePassword() {
  	if (this.validateCPForm()) {
  		this.setState({loadingCP: true, changePassErrMsg: '', changePassMsg: ''});
  		let params = {
  			phone: this.state.cpPhone.trim(),
  			code: this.state.cpCode.trim(),
  			password: this.state.cpPassword
  		}
  		User.actions.changeNewPassword.request(null, params).then(res => {
  			if (res.data && !res.data.error) {
  				this.setState({
  					changePassMsg: 'Change password successfully.'
  				})
  			}
  			this.setState({loadingCP: false,
  				cpPhone: '',
  				cpCode: '',
  				cpPassword: ''
  			});
  			setTimeout(()=> {
  				this.toggleModal('showLogin', true, 'showChangePass');
  			}, 2000);
  		}).catch( (error) => {
	      this.setState({loadingCP: false});
	      if (error.response && error.response.data) {
	        this.setState({changePassErrMsg: error.response.data.message});
	      }
	    });
  	}
  }

  render() {
    return (
			<header id="header" className="absolute fullwidth transparent">
			{/* Header */}

				{/* Top Bar */}
				<div id="top-bar" className={this.props.routeName != 'home' ? 'has-bg' : ''}>
					<div className="container">
						<div className="module left">
							<ul className="list-inline">
								<li><i className="i-before ti-email"></i>contact.sipboo@gmail.com</li>
								<li><i className="i-before ti-mobile"></i>+84 934 477 703</li>
							</ul>
						</div>
						<div className="module right">
							<span className="mr-20">Follow Us!</span>
							<a href="https://www.facebook.com/SipBoo-2039786402964976/" rel='noopener noreferrer' target="_blank" className="icon icon-xs icon-facebook"><i className="fa fa-facebook"></i></a>
						</div>
					</div>
				</div>

				{/* Navigation Bar */}
				<div id="nav-bar" className={this.props.routeName != 'home' ? 'has-bg' : ''}>

					<div className="container">
						{/* Menu Toggle  */}
						<div className="menu-toggle mr-0">
							<a href="javascript:void(0)" data-toggle="mobile-menu" className="mobile-trigger"><span><span></span></span></a>
						</div>
					{/* Logo */}
						<Link className="logo-wrapper pull-left" to="/">
							<img className="logo logo-dark" src={logoDark} alt="Sipboo"/>
						</Link>
						<form autoComplete="off" action="javascript:void(0)" className="navbar-form" onSubmit={this.handleSearch.bind(this)}>
							<div className="form-group">
								<i className="ti-search" onClick={this.handleSearch.bind(this)}></i>
								<input type="text" className="form-control" name="keySearch" value={this.state.keySearch} onChange={this.handleChange.bind(this)} placeholder="Search"/>
								{this.state.keySearch ?
									<a href="javascript:void(0)" onClick={this.clearSearch.bind(this)} className="clear-search"><strong>x</strong></a>
								:''}
							</div>
						</form>
						<nav className="module-group right">
							{/* Primary Menu */}
							<div className="module menu left">
								<ul id="nav-primary" className="nav nav-primary">
									<li>
										<Link to='/categories'>Categories</Link>
									</li>
									{
										this.state.isLogin && this.state.userInfo.role == 0 ?
											<li className="has-dropdown">
												<a href="javascript:void(0)">Manage</a>
												<ul>
													<li><Link to="/manage/restaurants">Restaurants</Link></li>
													<li><Link to="/manage/users">Users</Link></li>
													<li><Link to="/manage/sms/send">Send SMS</Link></li>
													<li><Link to="/manage/apn_firebase">APN/Fire Base</Link></li>
												</ul>
											</li>
										: null
									}
									{
										!this.state.isLogin ?
											<li >
												<a href="javascript:void(0)" onClick={this.toggleModal.bind(this, 'showLogin', true, '')}>
													<span>Login</span>
												</a>
											</li>
										:''
									}
									{
										!this.state.isLogin ?
											<li >
												<a href="javascript:void(0)" onClick={this.toggleModal.bind(this, 'showSignup', true, '')}>
													<span>Sign Up</span>
												</a>
											</li>
										:''
									}
									{
										this.state.isLogin ?
											<li className="has-dropdown">
												<a href="javascript:void(0)">{this.state.userInfo.fullname}</a>
												<ul>
													<li><a href="javascript:void(0)" onClick={this.handleLogout.bind(this)}>Logout</a></li>
												</ul>
											</li>
										:''
									}
									<li className="has-dropdown lang">
										<a href="javascript:void(0)">Language Version</a>
										<ul>
											<li><a href="javascript:void(0)">Vietnamese</a></li>
											<li><a href="javascript:void(0)">English</a></li>
										</ul>
									</li>
								</ul>
							</div>

							{/* Language Menu */}
							<div className="module language left">
								<ul className="nav nav-primary">
									<li className="has-dropdown">
										<a href="javascript:void(0)">Eng</a>
										<ul>
											<li><a href="javascript:void(0)">English</a></li>
											<li><a href="javascript:void(0)">Vietnamese</a></li>
										</ul>
									</li>
								</ul>
							</div>

							{/* Shopping Cart */}
							{
								this.props.routeName == 'rest_detail' ?
									<div className="module shopping-cart has-popup left">
										<span className="trigger" onMouseEnter={this.initOrder.bind(this)}><i className="ti-shopping-cart"></i></span>
										<div className="popup cart">
											<ul className="cart-items">
												{
													this.state.orders.map((item,key)=>{
														return (
															<li key={key}>
																<Link href="javascript:void(0)" className="image">
																	{
																		item.image.indexOf("no-image")!=-1 ? (
																			<div className="logo-dish" style={{
																				backgroundImage: `url(${imageNoDish})`
																			}}></div>
																		) : (
																			<div className="logo-dish" style={{
																				backgroundImage: `url(${item.image || imageNoDish})`
																			}}></div>
																		)
																	}
																</Link>
																<div className="content">
																	<a href="javascript:void(0)" className="mb-5">{item.name}</a>
																	<span className="price">{item.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} x {item.quantity}</span>
																</div>
															</li>
														);
													})
												}

											</ul>
											<div className="cart-bottom">
												<Link to={"/restaurant/order/"+(window.location.pathname.replace("/restaurant/","")) } className="btn btn-filled btn-primary btn-sm btn-block">Checkout <i className="i-after ti-arrow-right"></i></Link>
											</div>
										</div>

										<span id="notification-number" className="notification notification-number">0</span>


									</div>
								:''
							}

						</nav>


					</div>

				</div>

				{/* Notification Bar  */}
				<div id="notification-bar"></div>

			{/* Modal login  */}
				<Modal show={this.state.showLogin} dialogClassName="login-modal" onHide={this.toggleModal.bind(this, 'showLogin', false, '')}>
        	<div className="container-fluid">
        		<div className="email-login">
	            <h4 className="title">Signin</h4>
	            {this.state.errMsg != '' ? <div className="alert alert-danger login-email-error">{this.state.errMsg}</div> : ''}

      				<form action="javascript:void(0)" onSubmit={this.handleSubmit.bind(this)} noValidate className="login-form">
      					<div className="form-group form-group-cust input-icon-right">
      						<input type="text" className="form-control" placeholder="Enter your phone number" value={this.state.phone} name="phone" onChange={this.handleChange.bind(this)}/>
      						<i className="ti-mobile"></i>
      					</div>
		            <div className="form-group  form-group-cust input-icon-right">
		            	<input type="password" className="form-control" minLength="6" value={this.state.password} name="password" onChange={this.handleChange.bind(this)} placeholder="Enter your password"/>
		            	<i className="ti-lock"></i>
		            </div>
		            <div className="form-group">
		            	<div className="checkbox mt-5">
		            		<input type="checkbox" id="remember" value="on"/>
		            		<label htmlFor="remember">Remember me</label>
		            	</div>
		            	<a href="javascript:void(0)" onClick={this.toggleModal.bind(this, 'showForgot', true, 'showLogin')} className="pull-right mt-5">Forgot password</a>
		            </div>

		            <LaddaButton
					        loading={this.state.loading}
					        type="submit"
					        data-spinner-size={30}
					        className="btn btn-block btn-login btn-filled btn-primary"
					        data-style={EXPAND_LEFT}
					      >
					        Login
					      </LaddaButton>
				     	</form>
	            <div className="have-account clearfix">
	            	<span className="pull-left">Don't have a Sipboo account?</span>
	            	<button type="button" className="pull-right btn btn-primary" onClick={this.toggleModal.bind(this, 'showSignup', true, 'showLogin')}>Sign up</button>
	            </div>
        		</div>
        	</div>
        </Modal>
      {/* Modal Sign up  */}
				<Modal show={this.state.showSignup} dialogClassName="login-modal" onHide={this.toggleModal.bind(this, 'showSignup', false, '')}>
        	<div className="container-fluid">
        		<div className="email-login">

        			<h4 className="title">Sign Up</h4>
							{this.state.errMsgReg != '' ? <div className="alert alert-danger login-email-error">{this.state.errMsgReg}</div> : ''}
							{this.state.signupCode.step === 2 && this.state.errMsgReg == '' ? <div className="alert alert-success login-email-error">Your code has been successfully sent</div> : ''}

      				<form action="javascript:void(0)" onSubmit={this.handleSignup.bind(this)} noValidate className="login-form">

								{
									this.state.signupCode.step === 1 ? (
										<div>
											<div className="form-group">
												<input type="text" className="form-control" placeholder="Enter your fullname" value={this.state.fullname} name="fullname" onChange={this.handleChange.bind(this)}/>
											</div>
											<div className="form-group input-icon-right">
												<input type="text" className="form-control" placeholder="Enter your phone number" value={this.state.phoneReg} name="phoneReg" onChange={this.handleChange.bind(this)}/>
												<i className="ti-mobile"></i>
											</div>
											<div className="form-group input-icon-right">
												<input type="password" className="form-control" minLength="6" value={this.state.passwordReg} name="passwordReg" onChange={this.handleChange.bind(this)} placeholder="Enter your password"/>
												<i className="ti-lock"></i>
											</div>
										</div>
									) : null
								}
								{
									this.state.signupCode.step === 2 ? (
										<div>
											<div className="form-group">
												<input type="text" className="form-control" placeholder="Enter your code" value={this.state.code} name="code" onChange={this.handleChange.bind(this)}/>
											</div>

										</div>
									) : null
								}


		            <LaddaButton
					        loading={this.state.loadingReg}
					        type="submit"
					        data-spinner-size={30}
					        className="btn btn-block btn-login btn-filled btn-primary mt-15"
					        data-style={EXPAND_LEFT}
					      >
								{
									this.state.signupCode.step === 1 ? (
										"Sign Up"
									) : (
										"Submit"
									)
								}

					      </LaddaButton>
				      </form>
				      <div className="terms">By signing up, I agree to <a href="javascript:void(0)" className="text-primary">Sipboo? Terms of Service, Policy, Payments Terms of Service.</a></div>
	            <div className="have-account clearfix">
	            	<p className="pull-left">Already have a Sipboo account?</p>
	            	<button className="pull-right btn btn-primary" type="button" onClick={this.toggleModal.bind(this, 'showLogin', true, 'showSignup')}>Login</button>
	            </div>
        		</div>
        	</div>
        </Modal>
        <Modal show={this.state.showForgot} dialogClassName="login-modal" onHide={this.toggleModal.bind(this, 'showForgot', false, '')}>
        	{
        		this.state.forgotMsg ?
        			<div className="alert alert-success p-20 text-center">{this.state.forgotMsg}</div>
        		:null
        	}
        	{
        		this.state.forgotErrMsg ?
        			<div className="alert alert-danger p-20 text-center">{this.state.forgotErrMsg}</div>
        		:null
        	}
        	<div className="container-fluid">
        		<h2 className="forgot-title">Reset your password</h2>
        		<p className="pull-left">Enter your phone, and we'll send you a code so you can reset your password</p>
        		<form action="javascript:void(0)"  onSubmit={this.handleForgot.bind(this)} noValidate>
	        		<div className="form-group  form-group-cust input-icon-right mb-20">
	        			<input type="number" name="phoneForgot" value={this.state.phoneForgot} onChange={this.handleChange.bind(this)} className="form-control" placeholder="Enter your phone number"/>
	        		</div>
	        		<LaddaButton
				        loading={this.state.loadingForgot}
				        type="submit"
				        data-spinner-color="#1f1f1f"
				        data-spinner-size={30}
				        className="pull-right btn btn-primary btn-fullwidth"
				        data-style={EXPAND_LEFT}
				      >
				        SEND SMS
				      </LaddaButton>
	        	</form>
        	</div>
        </Modal>
        <Modal show={this.state.showChangePass} dialogClassName="login-modal" onHide={this.toggleModal.bind(this, 'showChangePass', false, '')}>
        	{
        		this.state.changePassMsg ?
        			<div className="alert alert-success p-20 text-center">{this.state.changePassMsg}</div>
        		:null
        	}
        	{
        		this.state.changePassErrMsg ?
        			<div className="alert alert-danger p-20 text-center">{this.state.changePassErrMsg}</div>
        		:null
        	}
        	<div className="container-fluid">
        		<h2 className="forgot-title">Change your password</h2>
        		<p className="pull-left">Enter your code from sms to change your password</p>
        		<form action="javascript:void(0)" onSubmit={this.handleChangePassword.bind(this)} noValidate>
							<div className="form-group form-group-cust input-icon-right">
								<input type="text" className="form-control" placeholder="Enter your phone number" value={this.state.cpPhone} name="cpPhone" onChange={this.handleChange.bind(this)}/>
								<i className="ti-mobile"></i>
							</div>

	        		<div className="form-group form-group-cust">
	        			<input type="text" name="cpCode" value={this.state.cpCode} onChange={this.handleChange.bind(this)} className="form-control" placeholder="Enter your code"/>

	        		</div>
							<div className="form-group form-group-cust mb-20">
								<input type="password" name="cpPassword" value={this.state.cpPassword} onChange={this.handleChange.bind(this)} className="form-control" placeholder="Enter new password"/>
							</div>

	        		<LaddaButton
				        loading={this.state.loadingCP}
				        type="submit"
				        data-spinner-color="#1f1f1f"
				        data-spinner-size={30}
				        className="pull-right btn btn-primary btn-fullwidth"
				        data-style={EXPAND_LEFT}
				      >
				        CHANGE PASSWORD
				      </LaddaButton>
	        	</form>
        	</div>
        </Modal>
			{/* Header / End  */}
			</header>
    );
  }
}

export default Header;
