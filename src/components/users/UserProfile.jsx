import React from 'react';
import {User} from 'api';
import {Rate} from 'components/sipboo';
import { EventEmitter } from 'base/helpers';
import {Link, browserHistory} from 'react-router';
// import LaddaButton, {EXPAND_LEFT} from 'react-ladda';
let noAvatar = require('assets/img/avatar-default.png');


class UserProfile extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      phone: '',
      errMsg: '',
      successMsg: '',
      user: {},
      images: [],
      loading: false,
      isLogin: localStorage.getItem('api_token') ? true : false,
    }
  }
  getOtherProfile() {
    let params = {
      id: this.props.params.id
    }
    User.actions.otherProfile.request(null, params).then(res => {
      if (res.data && res.data.data) {
        // console.log(res.data.data)
        this.setState({
          user: res.data.data
        });
      }
    });
  }
  componentDidMount() {
    this.getOtherProfile()
  }


  componentWillReceiveProps(nextProps) {
    
  }
  handleHire(shiper){
    let {isLogin} = this.state;
    // console.log(isLogin)
    if(isLogin){
      browserHistory.push(`/sipboo/hire/${shiper.id}`)
    }else {
      EventEmitter.emit("OpenLoginModal");
    }
  }
  render() {
    return (
      <div id="content" className="profile-page">
        
        <section className="section-xs section-content">
          <div className="container">
            <div className="row v-center-items first-col-title">
              <div className="col-md-3 avatar" style={{
                                      backgroundImage: `url(${ this.state.user.avatar ? this.state.user.avatar.replace("/upload/","/upload/w_530,c_thumb/w_530/") : noAvatar } )`
                                    }}>
                {/* <img className="mb-30" src="assets/img/members/member01_v2.jpg" alt=""/> */}
              </div>
              <div className="col-md-9">
                <h2 className="mb-10">{this.state.user.fullname}</h2>
                <div><Rate star={this.state.user.star}/></div>
                <div className="row">
                  <div className="col-sm-6">
                    <dl className="description-2">
                      <dt>Phone</dt>
                      <dd>{this.state.user.phone}</dd>
                      <dt>Address</dt>
                      <dd>{this.state.user.address || "N/A"}</dd>
                    </dl>
                  </div>
                  <div className="col-sm-6">
                    <dl className="description-2">
                      <dt>Nickname</dt>
                      <dd>{this.state.user.nick_name || "N/A"}</dd>
                      {/* <dt>Current company</dt>
                      <dd>Envato</dd> */}
                    </dl>
                  </div>
                  {/* <div className="col-sm-4">
                    <dl className="description-2">
                      <dt>Previous Company</dt>
                      <dd>Google Inc.</dd>
                    </dl>
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-sm-3"><a href={"tel:"+this.state.user.phone} className="btn btn-primary btn-filled btn-block">Call now</a></div>
                  <div className="col-sm-2"><Link onClick={this.handleHire.bind(this, this.state.user)} className="btn btn-primary btn-filled btn-block">Hire</Link></div>
                  {/* <div className="col-sm-4"><a href="#" className="btn btn-link btn-block">Hire me</a></div> */}
                </div>
                {/* <div className="row">
                <ul>
                  </ul>
                </div> */}
              </div>
            </div>
          </div>
        </section>
        
      </div>
    );
  }
}

export default UserProfile;
