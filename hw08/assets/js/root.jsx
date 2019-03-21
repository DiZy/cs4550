import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import TasksApp from './tasks-app';

export default function root_init(node, store, session) {
    ReactDOM.render(
      <Provider store={store}>
        <TasksApp />
      </Provider>, node);
}