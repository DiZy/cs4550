defmodule Hw08Web.PageController do
  use Hw08Web, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
