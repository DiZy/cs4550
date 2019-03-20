defmodule Hw08.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :desc, :string
    field :minutes, :integer
    field :name, :string
    field :user_id, :id

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:name, :desc, :minutes])
    |> validate_required([:name, :desc, :minutes])
  end
end
