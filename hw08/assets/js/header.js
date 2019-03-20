import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import api from './api';

class Header extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        email: "",
        password: "",
      }
  
      this.changeEmail = this.changeEmail.bind(this);
      this.changePassword = this.changePassword.bind(this);
      this.loadTaskForm = this.loadTaskForm.bind(this);
    }
  
    changeEmail(e) {
      this.setState({
        email: e.target.value
      });
    }
  
    changePassword(e) {
      this.setState({
        password: e.target.value
      });
    }

    loadTaskForm() {
      this.props.dispatch({
        type: 'SET_CREATE_TASK',
        data: null,
      });
    }
  
    render(){
      return <div className="row my-2">
        <div className="col-4">
          <h1><Link to={"/"} onClick={() => api.fetch_tasks()}>Tasks</Link></h1>
        </div>
        <div className="col-4">
          <h1><Link to={"/users"} onClick={() => api.fetch_users()}>Users</Link></h1>
        </div>
        <div className="col-4">
          <h1><Link to={"/taskform"} onClick={this.loadTaskForm}>Create</Link></h1>
        </div>
        {!this.props.session && 
        <div className="col-6">
          <div className="form-inline my-2">
            <input type="email" placeholder="email" value={this.state.email} onChange={this.changeEmail}/>
            <input type="password" placeholder="password" value={this.state.password} onChange={this.changePassword}/>
            <button className="btn btn-secondary"
              onClick={() => {
                api.create_session(this.state.email, this.state.password);
              }}>Login</button>
          </div>
        </div>}
        {this.props.session && <button className="btn btn-secondary">Logout</button>}
      </div>;
     }
    }


export default connect((state) => {return {session: state.session};})(Header);

