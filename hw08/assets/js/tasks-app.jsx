
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import api from './api';
import UserList from './users';

export default function root_init(node, store) {
    ReactDOM.render(
      <Provider store={store}>
        <TasksApp />
      </Provider>, node);
  }

class TasksApp extends React.Component {
    constructor(props) {
        super(props);

        api.fetch_users();
    }
    render() {
        return <div>
            <Router>
                <div>
                    <Header />
                    <div className="row">
                        <div className="col-8">
                            <Route path="/" exact={true} render={() =>
                                <div>Hi</div>
                            } />
                            <Route path="/users" exact={true} render={() =>
                                <UserList />
                            } />
                        </div>
                    </div>
                </div>
            </Router>
        </div>
    }
}

class Header extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    }

    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
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

  render(){
    return <div className="row my-2">
      <div className="col-4">
        <h1><Link to={"/"} onClick={() => api.fetch_products()}>Tasks</Link></h1>
      </div>
      <div className="col-4">
        <h1><Link to={"/users"} onClick={() => api.fetch_users()}>Users</Link></h1>
      </div>
      <div className="col-6">
        <div className="form-inline my-2">
          <input type="email" placeholder="email" value={this.state.email} onChange={this.changeEmail}/>
          <input type="password" placeholder="password" value={this.state.password} onChange={this.changePassword}/>
          <button className="btn btn-secondary"
            onClick={() => {
              api.create_session(this.state.email, this.state.password);
            }}>Login</button>
        </div>
      </div>
    </div>;
   }
  }