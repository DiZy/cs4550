defmodule Memory.Game do
  def new do
     %{
      userA: nil,
      userB: nil,
      turnA: true,
      shipA1: [],
      shipA2: [],
      shipB1: [],
      shipB2: [],
      winner: nil,
     }
  end

  def join(game, user) do
    if game.userA == nil or game.userA == user do
      Map.put(game, :userA, user)
    else
      if game.userB == nil do
        Map.put(game, :userB, user)
      else
        game
      end
    end
  end

  def shipDestroyed(ship) do
    undamaged = Enum.filter(ship, fn v -> 
      !v.hit
    end)

    length(undamaged) == 0
  end

  def attack(game, user, x, y) do
    attackerIsUserA = user == game.userA
    shipA1 = game.shipA1
    shipA2 = game.shipA2
    shipB1 = game.shipB1
    shipB2 = game.shipB2
    playerAReady = shipA1 != [] and shipA2 != []
    playerBReady = shipB1 != [] and shipB2 != []
    if playerAReady and playerBReady do
      if attackerIsUserA do
        game = Map.put(game, :turnA, false)
        shipB1 = game.shipB1
        shipB1 = Enum.map(shipB1, fn v ->
          if v.x == x and v.y == y do
            Map.put(v, :hit, true)
          else
            v
          end
        end)
        shipB2 = game.shipB2
        shipB2 = Enum.map(shipB2, fn v ->
          if v.x == x and v.y == y do
            Map.put(v, :hit, true)
          else
            v
          end
        end)
        game = Map.put(game, :shipB1, shipB1)
        game = Map.put(game, :shipB2, shipB2)
        if shipDestroyed(shipB1) and shipDestroyed(shipB2) do
          Map.put(game, :winner, game.userA)
        else
          game
        end
      else
        game = Map.put(game, :turnA, true)
        shipA1 = game.shipA1
        shipA1 = Enum.map(shipA1, fn v ->
          if v.x == x and v.y == y do
            Map.put(v, :hit, true)
          else
            v
          end
        end)
        shipA2 = game.shipA2
        shipA2 = Enum.map(shipA2, fn v ->
          if v.x == x and v.y == y do
            Map.put(v, :hit, true)
          else
            v
          end
        end)
        game = Map.put(game, :shipA1, shipA1)
        game = Map.put(game, :shipA2, shipA2)
        if shipDestroyed(shipA1) and shipDestroyed(shipA2) do
          Map.put(game, :winner, game.userB)
        else
          game
        end
      end
    else
      game
    end
  end

  def client_view(game, user) do
    isUserA = user == game.userA
    isUserB = user == game.userB    
    shipA1 = game.shipA1
    shipA2 = game.shipA2
    shipB1 = game.shipB1
    shipB2 = game.shipB2
    playerAReady = shipA1 != [] and shipA2 != []
    playerBReady = shipB1 != [] and shipB2 != []
    if isUserA do
      hitsOnOtherPlayerShip1 = Enum.filter(shipB1, fn v ->
        v.hit
      end)
      hitsOnOtherPlayerShip2 = Enum.filter(shipB2, fn v ->
        v.hit
      end)
      hitsOnOtherPlayer = Enum.concat(hitsOnOtherPlayerShip1, hitsOnOtherPlayerShip2)
      winner = if game.winner == nil, do: nil, else: (game.winner == game.userA && "You Win") || "You Lose"
      %{
        gameReady: playerAReady and playerBReady,
        selfPlayerReady: playerAReady,
        ship1: shipA1,
        ship2: shipA2,
        yourTurn: game.turnA,
        winner: winner,
        hitsOnOtherPlayer: hitsOnOtherPlayer,
        gameIsFull: false,
      }
    else
      if isUserB do
        hitsOnOtherPlayerShip1 = Enum.filter(shipA1, fn v ->
          v.hit
        end)
        hitsOnOtherPlayerShip2 = Enum.filter(shipA2, fn v ->
          v.hit
        end)
        hitsOnOtherPlayer = Enum.concat(hitsOnOtherPlayerShip1, hitsOnOtherPlayerShip2)
        winner = if game.winner == nil, do: nil, else: (game.winner == game.userB && "You Win") || "You Lose"
        %{
          gameReady: playerAReady and playerBReady,
          selfPlayerReady: playerBReady,
          ship1: shipB1,
          ship2: shipB2,
          yourTurn: !game.turnA,
          winner: winner,
          hitsOnOtherPlayer: hitsOnOtherPlayer,
          gameIsFull: false,
        }
      else
        %{
          gameIsFull: true,
        }
      end
    end
  end

  def placeShip(game, user, shipNumber, points) do
    isUserA = user == game.userA
    ship = Enum.map(points, fn v -> 
      %{x: v["x"], y: v["y"], hit: false}
    end)
    if isUserA do
      if shipNumber == 1 do
        Map.put(game, :shipA1, ship)
      else
        Map.put(game, :shipA2, ship)
      end
    else
      if shipNumber == 1 do
        Map.put(game, :shipB1, ship)
      else
        Map.put(game, :shipB2, ship)
      end
    end
  end

  def reset(game) do
    %{
      userA: game.userA,
      userB: game.userB,
      turnA: true,
      shipA1: [],
      shipA2: [],
      shipB1: [],
      shipB2: [],
      winner: nil,
     }
  end
end