defmodule Memory.GameServer do
  use GenServer

  def reg(name) do
    {:via, Registry, {Memory.GameReg, name}}
  end

  def start(name) do
    spec = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [name]},
      restart: :permanent,
      type: :worker,
    }
    Memory.GameSup.start_child(spec)
  end

  def start_link(name) do
    game = Memory.BackupAgent.get(name) || Memory.Game.new()
    GenServer.start_link(__MODULE__, game, name: reg(name))
  end

  def placeShip(name, user, shipNumber, points) do
    GenServer.call(reg(name), {:placeShip, name, user, shipNumber, points})
  end

  def attack(name, user, x, y) do
    GenServer.call(reg(name), {:attack, name, user, x, y})
  end

  def join(name, user) do
    GenServer.call(reg(name), {:join, name, user})
  end

  def show(name) do
    GenServer.call(reg(name), {:show, name})
  end

  def init(game) do
    {:ok, game}
  end

  def handle_call({:join, name, user}, _from, game) do
    game = Memory.Game.join(game, user)
    Memory.BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:placeShip, name, user, shipNumber, points}, _from, game) do
    game = Memory.Game.placeShip(game, user, shipNumber, points)
    Memory.BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:attack, name, user, x, y}, _from, game) do
    game = Memory.Game.attack(game, user, x, y)
    Memory.BackupAgent.put(name, game)
    {:reply, game, game}
  end
end
