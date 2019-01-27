defmodule Practice.Factor do
  def factor(x) do
    factor(x, 3, [])
  end

  def factor(x, curValue, factors) do
    cond do
      curValue > :math.sqrt(x) + 1 ->
        factors ++ [x]
      rem(x, 2) == 0 -> 
        factor(div(x, 2), curValue, factors ++ [2])
      rem(x, curValue) == 0 ->
        factor(div(x, curValue), curValue, factors ++ [curValue])
      true ->
        factor(x, curValue + 2, factors)
    end
  end
end

