import React from 'react';
import {Admin} from 'api';
import LaddaButton, {EXPAND_LEFT} from 'react-ladda';

class ManageAPN extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      errMsg: '',
      successMsg: '',
      message: '',
      user_id: '',
      send_type: '',
      loading: false
    }
  }

  componentDidMount() {
  
  }


  componentWillReceiveProps(nextProps) {
    
  }
  
  handleSubmit(event) {
    
  	if (this.validateForm()) {
	  	let params = {
	  		content: this.state.message,
	  		send_type: this.state.send_type,
	  		user_id: this.state.user_id
      }
      // console.log(params);
      // event.preventDefault();
      // return false;
      this.setState({
        loading: true,
        successMsg: '',
        errMsg: ''
      }, () => {
        Admin.actions.sendAPN.request(null, params).then(res => {
          if (res.data) {
            
          }
          this.setState({
            loading: false,
            content: '',
            successMsg: "The message has been sent to any guys"
          });
          setTimeout((e)=>{
            window.location.reload();
          }, 2000);
          event.preventDefault();
        }).catch( (error) => {
          this.setState({loading: false});
          if (error.response && error.response.data) {
            this.setState({errMsg: error.response.data.message});
          }
          event.preventDefault();
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
  	if (!this.state.message) {
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
                  <h3>Send APN/Fire Base to any guys</h3>
                  <p className="lead">Just use to notification to end user</p>
                </div>
                  <form name="sms" id="smdForm" onSubmit={this.handleSubmit.bind(this)}>
                    {this.state.errMsg != '' ? <div className="form-group"><div className="alert alert-danger login-email-error">{this.state.errMsg}</div></div> : ''}
                    {this.state.successMsg != '' ? <div className="form-group"><div className="alert alert-success login-email-error">{this.state.successMsg}</div></div> : ''}

                    <div className="form-group">
                      <label>User ID:</label>
                      <input  defaultValue={this.state.phone}  onChange={this.handleChange.bind(this)} name="user_id" type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                      <label>Type:</label>
                      <select className="form-control" onChange={this.handleChange.bind(this)} name="send_type">
                        <option value="">Fixed</option>
                        <option value="all">All</option>
                        <option value="sipboo">Only Sipboo</option>
                        <option value="user">Only User</option>
                      </select>
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

export default ManageAPN;
