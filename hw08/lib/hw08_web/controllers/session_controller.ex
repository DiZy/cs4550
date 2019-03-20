defmodule Hw08Web.SessionController do
    use Hw08Web, :controller

    alias Hw08.Users.User;
  
    def create(conn, %{"email" => email, "password" => password}) do
      with %User{} = user <- Hw08.Users.get_and_auth_user(email, password) do
        resp = %{
          data: %{
            token: Phoenix.Token.sign(Hw08Web.Endpoint, "user_id", user.id),
            user_id: user.id,
          }
        }
        conn
        |> put_resp_header("content-type", "application/json; charset=utf-8")
        |> send_resp(:created, Jason.encode!(resp))
      end
    end
  end