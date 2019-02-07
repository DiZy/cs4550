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
    cards = cards
    |> Enum.with_index
    |> Enum.map(fn {v, k} -> 
      if k == game.selected or k == game.secondSelected do
        v
      else
        if v == "empty" do
          "empty"
        else
          ""
        end
      end
    end)
    %{cards: cards, totalClicks: game.totalClicks}
  end

  def select(game, index) do
    game = Map.put(game, :totalClicks, game.totalClicks + 1)
    if game.selected == nil do
      game = Map.put(game, :selected, index)
      %{game: game, askForDeselect: false}
    else
      game = Map.put(game, :secondSelected, index)
      %{game: game, askForDeselect: true}
    end
  end

  def deselect(game) do
    letter1 = Enum.at(game.cards, game.selected)
    letter2 = Enum.at(game.cards, game.secondSelected)
    IO.puts("test")
    if letter1 == letter2 do
      IO.puts("replaced")
      cards = game.cards
      cards = List.replace_at(cards, game.selected, "empty")
      cards = List.replace_at(cards, game.secondSelected, "empty")
      IO.puts(cards)
      game = Map.put(game, :cards, cards)
      game = Map.put(game, :selected, nil)
      game = Map.put(game, :secondSelected, nil)
      game
    else
      game = Map.put(game, :selected, nil)
      game = Map.put(game, :secondSelected, nil)
      game
    end
  end

end
