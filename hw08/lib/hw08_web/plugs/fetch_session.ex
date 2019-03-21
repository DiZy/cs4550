defmodule Hw08.Plugs.FetchSession do
import Plug.Conn

def init(args), do: args

def call(conn, _args) do
    user_id = get_session(conn, :user_id)
    user_token = get_session(conn, :user_token)
    user = Hw08.Users.get_user(user_id || -1)
    if user do
        conn
        |> assign(:user_token, user_token)
        |> assign(:user_id, user_id)
    else
        conn
        |> assign(:user_token, nil)
        |> assign(:user_id, nil)
    end
end
end
