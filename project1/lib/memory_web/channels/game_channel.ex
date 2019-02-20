defmodule MemoryWeb.GameChannel do
  use MemoryWeb, :channel
  alias Memory.Game
  alias Memory.GameServer

  def join("game:" <> name, payload, socket) do
    if authorized?(payload) do
      user = socket.assigns[:user]
      _startServer = GameServer.start(name)
      game = GameServer.join(name, user)
      socket = socket
      |> assign(:name, name)
      {:ok, %{game: Game.client_view(game, user)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("placeShip", payload, socket) do
    name = socket.assigns[:name]
    user = socket.assigns[:user]
    game = GameServer.placeShip(name, user, payload.shipNumber, payload.points)
    {:ok, %{game: Game.client_view(game, user)}, socket}
  end

  def handle_in("attack", payload, socket) do
    name = socket.assigns[:name]
    user = socket.assigns[:user]
    game = GameServer.attack(name, user, payload.x, payload.y)
    {:ok, %{game: Game.client_view(game, user)}, socket}
  end
  
  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
