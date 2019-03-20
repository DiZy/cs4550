import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import api from './api';

class TaskEditor extends React.Component {
    constructor(props) {
        super(props);
        
    }
    render() {
        return <div>
            Editor
            {this.props.task_form.id}
        </div>;
    }
}


export default connect((state) => {return {task_form: state.task_form};})(TaskEditor);