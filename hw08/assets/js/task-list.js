import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import api from './api';

class TaskList extends React.Component {
    constructor(props) {
        super(props);
        api.fetch_tasks(props.session.user_id);
    }

    render() {
        let rows = _.map(this.props.tasks, (tt) => <Task key={tt.id} task={tt} dispatch={this.props.dispatch}/>);
        return <div className="row">
            <div className="col-12">
            My Tasks
            </div>
            <div className="col-12">
                <table className="table table-striped">
                <tbody>
                    {rows}
                </tbody>
                </table>
            </div>
        </div>;
    }
}

class Task extends React.Component {

    loadTaskForm() {
        this.props.dispatch({
            type: 'SET_EDIT_TASK',
            data: task,
        });
    }

    render() {
        return <tr>
                <td>{this.props.task.name}</td>
                <td>{this.props.task.desc}</td>
                <td>{this.props.task.minutes}</td>
                <td><Link to={"/taskform"} onClick={this.loadTaskForm}>Edit</Link> </td>
            </tr>;
    }
}

export default connect((state) => {return {tasks: state.tasks, session: state.session};})(TaskList);