defmodule Tasks1Web.PageController do
  use Tasks1Web, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
