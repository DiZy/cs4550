defmodule MemoryWeb.GameChannel do
  use MemoryWeb, :channel
  alias Memory.Game

  def join("game:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{join: name, game: Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("select", %{"index" => ii}, socket) do
    resp = Game.select(socket.assigns[:game], ii)
    socket = assign(socket, :game, resp.game)
    {:reply, {:ok, %{ game: Game.client_view(resp.game), askForDeselect: resp.askForDeselect}}, socket}
  end

  def handle_in("deselect", payload, socket) do
    game = Game.deselect(socket.assigns[:game])
    socket = assign(socket, :game, game)
    {:reply, {:deselected, %{ game: Game.client_view(game)}}, socket}
  end

  def handle_in("reset", payload, socket) do
    game = Game.new()
    socket = assign(socket, :game, game)
    {:reply, {:reset, %{ game: Game.client_view(game)}}, socket}
  end
  
  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
