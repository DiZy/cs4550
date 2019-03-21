defmodule Hw08Web.UserController do
  use Hw08Web, :controller

  alias Hw08.Users
  alias Hw08.Users.User

  action_fallback Hw08Web.FallbackController

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    adjusted_params = %{
      email: user_params["email"],
      admin: false,
      password_hash: Argon2.hash_pwd_salt(user_params["password"]),
    }
    with {:ok, %User{} = user} <- Users.create_user(adjusted_params) do
      token = Phoenix.Token.sign(Hw08Web.Endpoint, "user_id", user.id)
      resp = %{
        data: %{
          user_token: token,
          user_id: user.id,
        }
      }
      conn
      |> put_status(:created)
      |> put_session(:user_id, user.id)
      |> put_session(:user_token, token)
      |> put_resp_header("content-type", "application/json; charset=utf-8")
      |> send_resp(:created, Jason.encode!(resp))
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
