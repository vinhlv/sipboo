import React from 'react';
import {Link} from 'react-router';

let logoDark = require('assets/img/logo-sipboo.png');
class Footer extends React.Component {
  render() {
    return (
      <footer id="footer" className="dark bg-secondary">
        <div className="container">
          <div className="copyright">
            <div className="pull-left">
              <Link to="/"><img className="footer-logo mr-10" src={logoDark} alt="logo"/></Link>
            </div>
            <div className="terms-wrapper">
              <div className="terms">
                <Link to="/terms">Terms & policies</Link> &nbsp; | &nbsp; <Link to="/privacy">Privacy</Link>
              </div>
            </div>
            <div className="pull-right">
              <div className="copyright-text">© 2018 Sipboo. All Rights Reserved</div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
