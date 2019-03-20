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

  fetch_tasks(user_id) {
    this.fetch_path(
      "/api/tasks",
      (resp) => {
        store.dispatch({
          type: 'TASK_LIST',
          data: resp.data,
        });
      },
      {user_id: user_id}
    );
  }

  send_post(path, data, callback) {
    $.ajax(path, {
      method: "post",
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
}

export default new TheServer();