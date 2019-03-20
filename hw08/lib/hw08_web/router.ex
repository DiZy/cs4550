defmodule Hw08Web.Router do
  use Hw08Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Hw08Web do
    pipe_through :browser

    get "/", PageController, :index
  end

  scope "/api", Hw08Web do
    pipe_through :api

    resources "/auth", SessionController, only: [:create]
    resources "/users", UserController, except: [:new, :edit]
  end

  # Other scopes may use custom stacks.
  # scope "/api", Hw08Web do
  #   pipe_through :api
  # end
end
