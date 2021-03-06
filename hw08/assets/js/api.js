import store from './store';

class TheServer {
  fetch_path(path, callback, data = "") {
    $.ajax(path, {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: data,
      success: callback,
    });
  }

  fetch_users() {
    this.fetch_path(
      "/api/users",
      (resp) => {
        store.dispatch({
          type: 'USER_LIST',
          data: resp.data,
        });
      }
    );
  }

  fetch_tasks() {
    let state = store.getState();
    this.fetch_path(
      "/api/tasks",
      (resp) => {
        store.dispatch({
          type: 'TASK_LIST',
          data: resp.data,
        });
      },
      {user_id: state.session.user_id}
    );
  }

  submitCreateTask(callback) {
    var state = store.getState();
    this.send_post(
      "/api/tasks",
      {
        task: {
          name: state.task_form.name,
          desc: state.task_form.desc,
          minutes: state.task_form.minutes,
          complete: state.task_form.complete,
          user_id: state.task_form.user_id,
        },
      },
      callback
    );
  }

  submitEditTask(callback) {
    var state = store.getState();
    this.send_post(
      "/api/tasks/" + state.task_form.id,
      {
        id: state.task_form.id,
        task: {
          name: state.task_form.name,
          desc: state.task_form.desc,
          minutes: state.task_form.minutes,
          complete: state.task_form.complete,
          user_id: state.task_form.user_id
        },
      },
      callback,
      "put"
    );
  }

  send_post(path, data, callback, method = "post") {
    $.ajax(path, {
      method: method,
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(data),
      success: callback,
    });
  }

  create_session(email, password) {
    this.send_post(
      "/api/auth",
      {email, password},
      (resp) => {
        store.dispatch({
          type: 'NEW_SESSION',
          data: resp.data,
        });
      }
    );
  }

  register(email, password) {
    this.send_post(
      "/api/users",
      {
        user: {
          email: email,
          password: password,
        }
      },
      (resp) => {
        store.dispatch({
          type: 'NEW_SESSION',
          data: resp.data,
        });
      }
    );
  }

  logout() {
    let state = store.getState();
    let user_id = state.session.user_id
    this.send_post(
      "/api/auth/" + user_id,
      {id: user_id},
      (resp) => {
        store.dispatch({
          type: 'DELETE_SESSION',
          data: resp.data,
        });
      },
      "delete"
    )
  }
}

export default new TheServer();