defmodule Memory.Game do
  def new do
     %{
        cards: genCards(),
        selected: nil,
        secondSelected: nil,
        totalClicks: 0,
     }
  end

  def genCards do
    cards = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"]
    Enum.shuffle(cards)
  end

  def client_view(game) do
    cards = game.cards
    cards = Enum.map cards, fn {k, v} -> 
      if k == game.selected or k == game.secondSelected do
        v
      else
        ""
      end
    end
    cards
  end

  def select(game, index) do
    if game.selected == nil do
      game = Map.put(game, :selected, index)
      %{"game" => game, "askForDeselect" => false}
    else
      game = Map.put(game, :secondSelected, index)
      %{"game" => game, "askForDeselect" => true}
    end
  end

  def deselect(game) do
    letter1 = Enum.at(game.cards, game.selected)
    letter2 = Enum.at(game.cards, game.secondSelected)
    if letter1 == letter2 do
      cards = game.cards
      Enum.replace_at(cards, game.selected, nil)
      Enum.replace_at(cards, game.secondSelected, nil)
      game = Map.put(game, :cards, cards)
    end
    game = Map.put(game, :selected, nil)
    game = Map.put(game, :secondSelected, nil)
    game
  end

end
