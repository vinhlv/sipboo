import React from 'react';
import {Admin} from 'api';
import LaddaButton, {EXPAND_LEFT} from 'react-ladda';

class ManageSMS extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      phone: '',
      errMsg: '',
      successMsg: '',
      message: '',
      loading: false
    }
  }

  componentDidMount() {
  
  }


  componentWillReceiveProps(nextProps) {
    
  }
  toggleModal(name, status, otherName = '') {
  	this.setState({
  		[name]: status
  	});

  	if (otherName != '') {
  		this.setState({
	  		[otherName]: false
	  	});
  	}
  }
  handleSubmit(event) {
    
  	if (this.validateForm()) {
	  	let params = {
	  		phone: this.state.phone.trim(),
	  		content: this.state.message
	  	}
      this.setState({
        loading: true,
        successMsg: '',
        errMsg: ''
      }, () => {
        Admin.actions.sendSMS.request(null, params).then(res => {
          if (res.data) {
            
          }
          this.setState({
            loading: false,
            phone: '',
            message: '',
            successMsg: "The message has been sent to "+params.phone
          });
          setTimeout((e)=>{
            window.location.reload();
          }, 2000)
        }).catch( (error) => {
          this.setState({loading: false});
          if (error.response && error.response.data) {
            this.setState({errMsg: error.response.data.message});
          }
        });
      });
	  	
      // +1914-573-4727
    }
    event.preventDefault();
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
  	} else if (!this.state.message) {
  		pass = false;
  		this.setState({errMsg: 'Please enter your message.'});
  	}
  	return pass;
  }
  render() {
    return (
      <div id="content">
        <section className="pb-200">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-lg-push-2">
                <div className="text-center">
                  <h3>Send SMS to a phone number</h3>
                  <p className="lead">Just use to notification to end user</p>
                </div>
                  <form name="sms" id="smdForm" onSubmit={this.handleSubmit.bind(this)}>
                    {this.state.errMsg != '' ? <div className="form-group"><div className="alert alert-danger login-email-error">{this.state.errMsg}</div></div> : ''}
                    {this.state.successMsg != '' ? <div className="form-group"><div className="alert alert-success login-email-error">{this.state.successMsg}</div></div> : ''}

                    <div className="form-group">
                      <label>Phone number:</label>
                      <input  defaultValue={this.state.phone}  onChange={this.handleChange.bind(this)} name="phone" type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                      <label>Message:</label>
                      <textarea defaultValue={this.state.message} onChange={this.handleChange.bind(this)} name="message" className="form-control" rows="4"></textarea>
                    </div>
                    <div className="form-group">
                    <LaddaButton
                      loading={this.state.loading}
                      type="submit"
                      data-spinner-size={30}
                      className="btn btn-block btn-login btn-filled btn-primary"
                      data-style={EXPAND_LEFT}
                    >
                      Send
                    </LaddaButton>
                  
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default ManageSMS;
