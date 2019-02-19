defmodule MemoryWeb.GameChannel do
  use MemoryWeb, :channel
  alias Memory.Game
  alias Memory.GameServer

  def join("game:" <> name, payload, socket) do
    if authorized?(payload) do
      user = socket.assigns[:user]
      game = GameServer.show(name)
      socket = socket
      |> assign(:name, name)
      #{:ok, %{join: name, game: Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("placeShip", payload, socket) do
    name = socket.assigns[:name]
    user = socket.assigns[:user]
    GameServer.placeShip(name, user, payload.shipNumber, payload.points)
  end

  def handle_in("attack", payload, socket) do
    name = socket.assigns[:name]
    user = socket.assigns[:user]
    GameServer.attack(name, user, payload.x, payload.y)
  end
  
  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
