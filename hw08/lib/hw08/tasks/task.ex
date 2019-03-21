defmodule Hw08.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :desc, :string
    field :minutes, :integer
    field :name, :string
    field :complete, :boolean
    belongs_to :user, Hw08.Users.User

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:name, :desc, :minutes, :user_id, :complete])
    |> cast_assoc(:user)
    |> validate_required([:name, :desc, :minutes, :complete])
  end
end
