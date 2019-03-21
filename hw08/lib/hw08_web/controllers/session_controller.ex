defmodule Hw08Web.SessionController do
    use Hw08Web, :controller

    alias Hw08.Users.User;
  
    def create(conn, %{"email" => email, "password" => password}) do
      with %User{} = user <- Hw08.Users.get_and_auth_user(email, password) do
        token = Phoenix.Token.sign(Hw08Web.Endpoint, "user_id", user.id)
        resp = %{
          data: %{
            user_token: token,
            user_id: user.id,
          }
        }
        conn
        |> put_session(:user_id, user.id)
        |> put_session(:user_token, token)
        |> put_resp_header("content-type", "application/json; charset=utf-8")
        |> send_resp(:created, Jason.encode!(resp))
      end
    end

    def delete(conn, _params) do
      conn
      |> delete_session(:user_id)
      |> delete_session(:user_token)
      |> put_resp_header("content-type", "application/json; charset=utf-8")
      |> send_resp(:ok, Jason.encode!(%{status: true}))
    end
  end