defmodule Tasks1Web.TaskController do
  use Tasks1Web, :controller

  alias Tasks1.Tasks
  alias Tasks1.Tasks.Task

  def index(conn, _params) do
    tasks = Tasks.list_tasks()
    render(conn, "index.html", tasks: tasks)
  end

  def new(conn, _params) do
    changeset = Tasks.change_task(%Task{})
    user = conn.assigns.current_user
    emailsAvailable = Enum.map(user.usersmanaged, fn x -> x.email end)
    emailsAvailable = [user.email] ++ emailsAvailable
    currentEmail = user.email
    render(conn, "new.html", changeset: changeset, emailsAvailable: emailsAvailable, currentEmail: currentEmail, isNew: true)
  end

  def create(conn, %{"task" => task_params}) do
    useremail = task_params["username"]
    current_user = conn.assigns.current_user
    _ = IO.puts(useremail)
    user = Tasks1.Users.get_user_by_email(useremail)
    user_id = user.id
    {_, task_params} = Map.pop(task_params, "username")
    task_params = Map.put(task_params, "user_id", user_id)

    emailsAvailable = Enum.map(current_user.usersmanaged, fn x -> x.email end)
    emailsAvailable = [current_user.email] ++ emailsAvailable
    currentEmail = user.email
    case Tasks.create_task(task_params) do
      {:ok, task} ->
        conn
        |> put_flash(:info, "Task created successfully.")
        |> redirect(to: "/")

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset, emailsAvailable: emailsAvailable, currentEmail: currentEmail, isNew: true)
    end
  end

  def show(conn, %{"id" => id}) do
    task = Tasks.get_task(id)
    render(conn, "show.html", task: task)
  end

  def edit(conn, %{"id" => id}) do
    task = Tasks.get_task(id)
    changeset = Tasks.change_task(task)
    user = conn.assigns.current_user
    emailsAvailable = Enum.map(user.usersmanaged, fn x -> x.email end)
    emailsAvailable = [user.email] ++ emailsAvailable
    currentEmail = task.user.email
    render(conn, "edit.html", task: task, changeset: changeset, emailsAvailable: emailsAvailable, currentEmail: currentEmail, isNew: false)
  end

  def update(conn, %{"id" => id, "task" => task_params}) do
    task = Tasks.get_task(id)
    useremail = task_params["username"]
    current_user = conn.assigns.current_user
    _ = IO.puts(useremail)
    user = Tasks1.Users.get_user_by_email(useremail)
    user_id = user.id
    {_, task_params} = Map.pop(task_params, "username")
    task_params = Map.put(task_params, "user_id", user_id)

    emailsAvailable = Enum.map(current_user.usersmanaged, fn x -> x.email end)
    emailsAvailable = [current_user.email] ++ emailsAvailable
    currentEmail = task.user.email

    case Tasks.update_task(task, task_params) do
      {:ok, task} ->
        conn
        |> put_flash(:info, "Task updated successfully.")
        |> redirect(to: "/")

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", task: task, changeset: changeset, emailsAvailable: emailsAvailable, currentEmail: currentEmail, isNew: false)
    end
  end

  def delete(conn, %{"id" => id}) do
    task = Tasks.get_task!(id)
    {:ok, _task} = Tasks.delete_task(task)

    conn
    |> put_flash(:info, "Task deleted successfully.")
    |> redirect(to: "/")
  end
end
