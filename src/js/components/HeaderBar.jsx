import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import {getSession, isAuthenticated, resetSession} from '../services/SessionService';
import {Link} from 'react-router';
/**
 * Representing the header bar
 */
class HeaderBar extends Component {
/**
  * Class constructor
  * @param {Object} props User define component
  */
  constructor(props) {
    super(props);
  }
/**
 *Navigates to the login page
 */
  login() {
    browserHistory.push('/login');
  }
/**
 * Sets the authenticated false and navigates to the home page
 */
  signOut() {
    resetSession();
    isAuthenticated() === false;
    browserHistory.push('/home');
  }
  /**
   * Navigates to the home page
   */
  navaigateHome() {
    browserHistory.push('/home');
  }
/**
 * Navigate to the blogs page
 */
  navaigateBlogs() {
    browserHistory.push('/blogs');
  }
/**
 * Navigate to the about us page
 */
  navaigateAboutUs() {
    browserHistory.push('/aboutUs');
  }
  /**
  * Describes the elements on the registration page
  * @return {String} HTML elements
  */
  render() {
    const login = this.login.bind(this);
    const authenticated = getSession().authenticated;
    const signOut = this.signOut.bind(this);
    let container = <div className="container">
      <div className="row">
        <div className="col-12">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand" href="index.html">
                  <img src="img/logo.png" alt="Logo"/>
                </a>
              </div>
              <div className="navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav navbar-right">
                  <li><Link to="/home">Home</Link></li>
                  <li><Link to="/blogs">Blogs</Link></li>
                  <li><Link to="/aboutUs">About Us</Link></li>
                  <li><Link to="/login">Login</Link></li>
              </ul>
              </div>
              </div>
            </nav>
          </div>
        </div>
      </div>;
    if (authenticated) {
      let message = 'Welcome!';
      const user = getSession().user.name;
      if(user) {
        message = `Welcome ${user}`;
      }
      console.log('authenticated');
      container = <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="navbar navbar-default">
                <div className="container-fluid">
                  <div className="navbar-header">
                    <a className="navbar-brand" href="index.html">
                        <img src="img/logo.png" alt="Logo"/>
                    </a>
                  </div>
                  <div className="navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right">
                      <li><Link to="/home">Home</Link></li>
                      <li><Link to="/blogs">Blogs</Link></li>
                      <li><Link to="/aboutUs">About Us</Link></li>
                      <a className="btn btn-default btn-call-to-action" onClick={signOut} >Sign out</a>
                  </ul>
                  </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>;
    }


    return (
      <div>
        <header>
        {container}
          </header>
      </div>
    );
  }
}

export default HeaderBar;
