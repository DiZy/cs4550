defmodule Tasks1Web.TimeblockControllerTest do
  use Tasks1Web.ConnCase

  alias Tasks1.Timeblocks

  @create_attrs %{end: ~N[2010-04-17 14:00:00], start: ~N[2010-04-17 14:00:00]}
  @update_attrs %{end: ~N[2011-05-18 15:01:01], start: ~N[2011-05-18 15:01:01]}
  @invalid_attrs %{end: nil, start: nil}

  def fixture(:timeblock) do
    {:ok, timeblock} = Timeblocks.create_timeblock(@create_attrs)
    timeblock
  end

  describe "index" do
    test "lists all timeblocks", %{conn: conn} do
      conn = get(conn, Routes.timeblock_path(conn, :index))
      assert html_response(conn, 200) =~ "Listing Timeblocks"
    end
  end

  describe "new timeblock" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.timeblock_path(conn, :new))
      assert html_response(conn, 200) =~ "New Timeblock"
    end
  end

  describe "create timeblock" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post(conn, Routes.timeblock_path(conn, :create), timeblock: @create_attrs)

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.timeblock_path(conn, :show, id)

      conn = get(conn, Routes.timeblock_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Show Timeblock"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.timeblock_path(conn, :create), timeblock: @invalid_attrs)
      assert html_response(conn, 200) =~ "New Timeblock"
    end
  end

  describe "edit timeblock" do
    setup [:create_timeblock]

    test "renders form for editing chosen timeblock", %{conn: conn, timeblock: timeblock} do
      conn = get(conn, Routes.timeblock_path(conn, :edit, timeblock))
      assert html_response(conn, 200) =~ "Edit Timeblock"
    end
  end

  describe "update timeblock" do
    setup [:create_timeblock]

    test "redirects when data is valid", %{conn: conn, timeblock: timeblock} do
      conn = put(conn, Routes.timeblock_path(conn, :update, timeblock), timeblock: @update_attrs)
      assert redirected_to(conn) == Routes.timeblock_path(conn, :show, timeblock)

      conn = get(conn, Routes.timeblock_path(conn, :show, timeblock))
      assert html_response(conn, 200)
    end

    test "renders errors when data is invalid", %{conn: conn, timeblock: timeblock} do
      conn = put(conn, Routes.timeblock_path(conn, :update, timeblock), timeblock: @invalid_attrs)
      assert html_response(conn, 200) =~ "Edit Timeblock"
    end
  end

  describe "delete timeblock" do
    setup [:create_timeblock]

    test "deletes chosen timeblock", %{conn: conn, timeblock: timeblock} do
      conn = delete(conn, Routes.timeblock_path(conn, :delete, timeblock))
      assert redirected_to(conn) == Routes.timeblock_path(conn, :index)
      assert_error_sent 404, fn ->
        get(conn, Routes.timeblock_path(conn, :show, timeblock))
      end
    end
  end

  defp create_timeblock(_) do
    timeblock = fixture(:timeblock)
    {:ok, timeblock: timeblock}
  end
end
