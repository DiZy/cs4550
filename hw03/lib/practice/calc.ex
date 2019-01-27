defmodule Practice.Calc do
  def parse_float(text) do
    {num, _} = Float.parse(text)
    num
  end

  def calc(expr) do
    # This should handle +,-,*,/ with order of operations,
    # but doesn't need to handle parens.

    splitup = String.split(expr)
    partly = evalMulDiv(tl(splitup), parse_float(hd(splitup)))
    evalAddSub(tl(partly), hd(partly))
  end

  def evalMulDiv(list, prev) do
    if length(list) <= 1 do
      [prev] ++ list
    else 
      next = hd(list)
      rest = tl(list)
      second = parse_float(hd(rest))
      cond do
        next == "+" or next =="-" ->
          [prev, next] ++ evalMulDiv(tl(rest), second) 
        next == "*" ->
          evalMulDiv(tl(rest), prev * second)
        next == "/" ->
          evalMulDiv(tl(rest), prev / second)
      end
    end
  end

  def evalAddSub(list, total) do
    if length(list) <= 1 do
      total
    else
      op = hd(list)
      second = hd(tl(list))
      rest = tl(tl(list))
      cond do
        op == "+" ->
          evalAddSub(rest, total + second)
        op == "-" ->
          evalAddSub(rest, total - second)
      end
    end
  end
end
