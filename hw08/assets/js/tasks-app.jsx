
import React from 'react';
import ReactDOM from 'react-dom';

export default function root_init(node) {
    ReactDOM.render(
      <TasksApp />, node);
  }

class TasksApp extends React.Component {
    render() {
        return <div>"test"</div>
    }
}