import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import api from './api';

class TaskEditor extends React.Component {
    constructor(props) {
        super(props);
        
        this.changeDesc = this.changeDesc.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changeMinutes = this.changeMinutes.bind(this);
        this.changeComplete = this.changeComplete.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.submitCreate = this.submitCreate.bind(this);
        this.exitForm = this.exitForm.bind(this);
    }

    changeDesc(e) {
        this.props.dispatch({
            type: 'SET_TASK_DESC',
            data: e.target.value,
        });
    }

    changeName(e) {
        this.props.dispatch({
            type: 'SET_TASK_NAME',
            data: e.target.value,
        });
    }

    changeMinutes(e) {
        this.props.dispatch({
            type: 'SET_TASK_MINUTES',
            data: e.target.value,
        });
    }

    changeComplete(e) {
        this.props.dispatch({
            type: 'SET_TASK_COMPLETE',
            data: e.target.checked,
        });
    }

    changeUser(e) {
        this.props.dispatch({
            type: 'SET_TASK_USER',
            data: e.target.value,
        });
    }

    exitForm() {
        this.props.history.push('/');
        this.props.dispatch({
            type: 'CLEAR_TASK_FORM',
            data: null,
        });
    }

    submitEdit() {
        api.submitEditTask(this.exitForm);
    }

    submitCreate() {
        api.submitCreateTask(this.exitForm);
    }


    render() {
        let options = this.props.users.map((user) => 
            <option value={user.id} key={user.id}>{user.email}</option>);
        return <div>
                {(!this.props.task_form.isNew && <h1>Edit Task</h1>) || <h1>Create Task</h1>}
                <h3>Name: </h3>
                <input 
                    type='text' 
                    className='form-control input'
                    value={this.props.task_form.name}
                    onChange={this.changeName} />

                <h3>Description: </h3>
                <input 
                    type='text' 
                    className='form-control input'
                    value={this.props.task_form.desc}
                    onChange={this.changeDesc} />

                <h3>Minutes: </h3>
                <input 
                    type='number' 
                    className='form-control input'
                    value={this.props.task_form.minutes}
                    onChange={this.changeMinutes} />
                
                <h3>Complete: </h3>
                <input 
                    type='checkbox' 
                    className='form-control input'
                    checked={this.props.task_form.complete}
                    onChange={this.changeComplete} />
                
                <select className='form-control' onChange={this.changeUser} value={this.props.task_form.user_id}>
                    {options}
                </select>
                    

                {this.props.task_form.isNew &&
                    <button className='btn btn-secondary' onClick={this.submitCreate}>Create</button>}

                {!this.props.task_form.isNew &&
                    <button className='btn btn-secondary' onClick={this.submitEdit}>Edit</button>}
            </div>;
    }
}


TaskEditor = withRouter(TaskEditor);
export default connect((state) => {return {task_form: state.task_form, users: state.users};})(TaskEditor);