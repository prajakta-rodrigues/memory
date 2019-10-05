defmodule Memory.Game do

  def new() do
    %{
      currentTileState: current_state(),
      test: "test",
      openTiles: [],
      waiting: false,
      score: 0,
      isGameOver: false
    }
  end

  def current_state do
    alpha = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H"
    ]
    alpha = alpha ++ alpha;
    alpha = alpha |> Enum.shuffle;
    currentTileState = init_state_row(%{}, alpha, 4, 4);
    IO.inspect(currentTileState);
    currentTileState
  end

  def init_state_row(currentTileState, alpha, noOfRows, noOfColumns) do
    if noOfRows == 0 do
      currentTileState
    else
      currentRowState = init_state_col(%{}, alpha, noOfRows, noOfColumns) ;
      currentTileState = Map.put(currentTileState, noOfRows, currentRowState);
      init_state_row(currentTileState, alpha, noOfRows-1, noOfColumns)
    end
  end

  def init_state_col(currentRowState, alpha, rowNo, noOfColumns) do
    if noOfColumns == 0 do
      currentRowState
    else
      currentColState = %{
        class: "tile",
        value: Enum.at(alpha, (rowNo-1) * 4 + noOfColumns - 1),
        open: false,
        done: false
        }
      currentRowState = Map.put(currentRowState, noOfColumns, currentColState);
      init_state_col(currentRowState, alpha, rowNo, noOfColumns - 1 );
    end
  end


  def tile_click(game, id) do
    if game.waiting == true do
      game
    end
    idSplitted = String.split(id);
    {i, _} = Enum.at(idSplitted, 0) |> Integer.parse;
    {j, _} = Enum.at(idSplitted, 1) |> Integer.parse;
    %{^i => y} = game.currentTileState;
    %{^j => z} = y;
    openTiles = game.openTiles;
    waiting = game.waiting;
    c = game.currentTileState;
    score = game.score;
    if z.done == true || z.open == true do
      game
    else
      score = score - 2;
      if length(openTiles) == 1 do
        idone = Enum.at(openTiles, 0);
        idone = String.split(idone);
        {ione, _} = Enum.at(idone, 0) |> Integer.parse;
        {jone, _} = Enum.at(idone, 1) |> Integer.parse;
        %{^ione => yone} = c;
        %{^jone => zone} = yone;
        if z.value == zone.value do
          z = Map.put(z, :class, "done-tile");
          z = Map.put(z, :open, false);
          z = Map.put(z, :done, true);
          y = Map.put(y, j, z);
          c = Map.put(game.currentTileState, i, y);
          IO.inspect(y);
          %{^ione => yone} = c;
          %{^jone => zone} = yone;
          zone = Map.put(zone, :class, "done-tile");
          zone = Map.put(zone, :open, false);
          zone = Map.put(zone, :done, true);
          yone = Map.put(yone, jone, zone);
          IO.inspect(yone);
          openTiles = [];
          score = score + 40;
          c = Map.put(c, ione, yone);
          game = Map.put(game, :currentTileState, c);
          game = Map.put(game, :score, score);
          game = Map.put(game, :openTiles, openTiles);
          IO.puts "in len1 equal";
          IO.inspect(game);
          gameover = check_if_game_over(game);
          game = Map.put(game, :isGameOver, gameover);
          game
        else
          z = Map.put(z, :class, "tile");
          z = Map.put(z, :open, false);
          zone = Map.put(zone, :class, "tile");
          zone = Map.put(zone, :open, false);
          openTiles = [];
          y = Map.put(y, j, z);
          yone = Map.put(yone, jone, zone);
          c = Map.put(game.currentTileState, i, y);
          c = Map.put(c, ione, yone);

          game = Map.put(game, :currentTileState, c);
          game = Map.put(game, :score, score);
          game = Map.put(game, :openTiles, openTiles);
          IO.puts "in len1 not equal";
          IO.inspect(game);
          game
        end
      else
        z = Map.put(z, :class, "open-tile");
        z = Map.put(z, :open, true);
        openTiles = [id];
        y = Map.put(y, j, z);
        c = Map.put(game.currentTileState, i, y);
        IO.puts "only one"
        game = Map.put(game, :currentTileState, c);
        game = Map.put(game, :score, score);
        game = Map.put(game, :openTiles, openTiles);
        IO.inspect(game);
        game
      end
    end
  end


  def check_if_game_over(game) do
    IO.puts "in here"
    false;
    check_if_game_over(game, 4, 4, true);
  end

  def check_if_game_over(game, rowno, colno, result) do
    if rowno == 0 do
      result;
    else
      c = game.currentTileState
      %{^rowno => row} = c;
      result = result && check_if_game_over(row, colno, result)
      check_if_game_over(game, rowno-1, colno, result)
    end
  end

  def check_if_game_over(row, colno, result) do
    if colno == 0 do
      result;
    else
      %{^colno => column} = row;
      result = result && column.done;
      check_if_game_over(row, colno - 1, result)
    end
  end






  def restart_game(game) do
    %{
      currentTileState: current_state(),
      test: "test",
      openTiles: [],
      waiting: false,
      score: 0,
      isGameOver: false
    }
  end


  def client_view(game) do
    %{
      openTiles: game.openTiles,
      currentTileState: game.currentTileState,
      waiting: game.waiting,
      score: game.score,
      isGameOver: game.isGameOver
    }
  end
end
