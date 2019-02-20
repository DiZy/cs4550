defmodule MemoryWeb.Router do
  use MemoryWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :put_user_token
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", MemoryWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/game/:name/:user_name", PageController, :game
  end

  defp put_user_token(conn, _) do
    user = get_session(conn, :user)
    if current_user = user do
      token = Phoenix.Token.sign(conn, "user socket", user)
      assign(conn, :user_token, token)
    else
      conn
    end
  end

  # Other scopes may use custom stacks.
  # scope "/api", MemoryWeb do
  #   pipe_through :api
  # end
end
