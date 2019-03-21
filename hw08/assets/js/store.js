import { createStore, combineReducers } from 'redux';
import deepFreeze from 'deep-freeze';
import _ from 'lodash'; 

/*
  Application state layout
  {
    // Session
    session: null, // { token, user_id }
    
    // DB Caches
    users: [], // List of User
    tasks: [], // List of Task,

    // Form Stuff
    task_form: [], // Task Form Info
  }
*/

// For each component of the state:
//  * Function with the same name
//  * Default is the default value of that component

function users(state = [], action) {
  switch (action.type) {
    case 'USER_LIST':
      return action.data;
    default:
      return state;
  }
}

function session(state = null, action) {
  switch (action.type) {
    case 'NEW_SESSION':
      return action.data;
    default:
      return state;
  }
}

function tasks(state = [], action) {
  switch (action.type) {
    case 'TASK_LIST':
      return action.data;
    default:
      return state;
  }
}

function task_form(state = null, action) {
  switch(action.type) {
    case 'SET_CREATE_TASK':
      return {
        isNew: true,
        id: null,
        minutes: "",
        name: "",
        desc: "",
        complete: false,
      };
    case 'SET_EDIT_TASK':
      return {
        isNew: false,
        id: action.data.id,
        minutes: action.data.minutes,
        name: action.data.name,
        desc: action.data.desc,
        complete: action.data.complete,
      };
    case 'SET_TASK_NAME':
      return _.assign({}, state, {
        name: action.data
      });
    case 'SET_TASK_MINUTES':
      return _.assign({}, state, {
        minutes: action.data
      });
    case 'SET_TASK_DESC':
      console.log(action.data);
      return _.assign({}, state, {
        desc: action.data
      });
    case 'CLEAR_TASK_FORM':
      return null;
    default:
      return state;
  }
}

function root_reducer(state0, action) {
  console.log("reducer", state0, action);

  let reducer = combineReducers({users, session, tasks, task_form});
  let state1 = reducer(state0, action);

  console.log("reducer1", state1);

  return deepFreeze(state1);
}

let store = createStore(root_reducer);
export default store;