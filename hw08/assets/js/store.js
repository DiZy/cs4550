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
    case 'DELETE_SESSION':
      return null;
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
        minutes: 0,
        name: "",
        desc: "",
        complete: false,
        user_id: action.data.user_id
      };
    case 'SET_EDIT_TASK':
      return {
        isNew: false,
        id: action.data.id,
        minutes: action.data.minutes,
        name: action.data.name,
        desc: action.data.desc,
        complete: action.data.complete,
        user_id: action.data.user_id
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
      return _.assign({}, state, {
        desc: action.data
      });
    case 'SET_TASK_COMPLETE':
      return _.assign({}, state, {
        complete: action.data
      });
    case 'SET_TASK_USER':
      return _.assign({}, state, {
        user_id: action.data
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

let initSession = null;
if(window.userId && window.userToken) {
  initSession = {
    token: window.userToken,
    user_id: window.userId,
  };
}
let store = createStore(root_reducer, {session: initSession});
export default store;