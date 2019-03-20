import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import api from './api';
import UserList from './users';
import Header from './header';
import TaskList from './task-list';
import TaskEditor from './task-editor';
import { connect } from 'react-redux';

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
                    {this.props.session && 
                        <div className="row">
                            <div className="col-8">
                                <Route path="/" exact={true} render={() =>
                                    <TaskList />
                                } />
                                <Route path="/users" exact={true} render={() =>
                                    <UserList />
                                } />
                                <Route path="/taskform" exact={true} render={() =>
                                    <TaskEditor />
                                } />
                            </div>
                        </div>
                    }
                    {!this.props.session && 
                        <div>Please login</div>
                    }
                </div>
            </Router>
        </div>
    }
}



export default connect((state) => {return {session: state.session};})(TasksApp);

