defmodule MemoryWeb.GameChannel do
  use MemoryWeb, :channel
  alias Memory.Game
  alias Memory.BackupAgent

  def join("game:" <> name, payload, socket) do
    if authorized?(payload) do
      game = BackupAgent.get(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      BackupAgent.put(name, game)
      {:ok, %{join: name, game: Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("select", %{"index" => ii}, socket) do
    name = socket.assigns[:name]
    resp = Game.select(socket.assigns[:game], ii)
    socket = assign(socket, :game, resp.game)
    BackupAgent.put(name, resp.game)
    {:reply, {:ok, %{ game: Game.client_view(resp.game), askForDeselect: resp.askForDeselect}}, socket}
  end

  def handle_in("deselect", _payload, socket) do
    name = socket.assigns[:name]
    game = Game.deselect(socket.assigns[:game])
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:deselected, %{ game: Game.client_view(game)}}, socket}
  end

  def handle_in("reset", _payload, socket) do
    game = Game.new()
    name = socket.assigns[:name]
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:reset, %{ game: Game.client_view(game)}}, socket}
  end
  
  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
