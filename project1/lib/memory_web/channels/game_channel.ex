defmodule MemoryWeb.GameChannel do
  use MemoryWeb, :channel
  alias Memory.Game
  alias Memory.GameServer

  intercept ["send_update", "reset"]

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
    game = GameServer.placeShip(name, user, payload["shipNumber"], payload["points"])
    broadcast!(socket, "send_update", %{})
    {:reply, {:ok, %{game: Game.client_view(game, user)}}, socket}
  end

  def handle_in("attack", payload, socket) do
    name = socket.assigns[:name]
    user = socket.assigns[:user]
    game = GameServer.attack(name, user, payload["x"], payload["y"])
    broadcast!(socket, "send_update", %{})
    {:reply, {:ok, %{game: Game.client_view(game, user)}}, socket}
  end

  def handle_in("reset", _payload, socket) do
    name = socket.assigns[:name]
    user = socket.assigns[:user]
    game = GameServer.reset(name)
    broadcast!(socket, "reset", %{})
    {:reply, {:ok, %{game: Game.client_view(game, user)}}, socket}
  end

  def handle_out("send_update", _payload, socket) do
    name = socket.assigns[:name]
    user = socket.assigns[:user]
    game = GameServer.show(name)
    push(socket, "update", %{game: Game.client_view(game, user)})
    {:noreply, socket}
  end

  def handle_out("reset", _payload, socket) do
    name = socket.assigns[:name]
    user = socket.assigns[:user]
    game = GameServer.show(name)
    push(socket, "reset", %{game: Game.client_view(game, user)})
    {:noreply, socket}
  end
  
  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end