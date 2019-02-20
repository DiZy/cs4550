defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, %{"name" => name, "user_name" => user_name}) do
    conn = put_session(conn, :user, user_name)
    render conn, "game.html", name: name
  end
end
