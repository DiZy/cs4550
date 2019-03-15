defmodule Tasks1Web.Router do
  use Tasks1Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Tasks1.Plugs.FetchSession
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :ajax do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :fetch_flash
    plug Tasks1.Plugs.FetchSession
  end

  scope "/", Tasks1Web do
    pipe_through :browser

    get "/", PageController, :index

    resources "/users", UserController
    resources "/tasks", TaskController

    resources "/timeblocks", TimeblockController, except: [:create]

    resources "/sessions", SessionController, only: [:create, :delete], singleton: true
  end

  scope "/ajax", Tasks1Web do
    pipe_through :ajax
    resources "/taskstartstop", TimeblockController, only: [:create]
  end

  # Other scopes may use custom stacks.
  # scope "/api", Tasks1Web do
  #   pipe_through :api
  # end
end
