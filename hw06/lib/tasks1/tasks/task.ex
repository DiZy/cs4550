defmodule Tasks1.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset


  schema "tasks" do
    field :name, :string
    field :desc, :string
    field :minutes, :integer
    field :complete, :boolean
    belongs_to :user, Tasks1.Users.User

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:name, :desc, :user_id, :minutes, :complete])
    |> cast_assoc(:user)
    |> validate_required([:name, :desc, :minutes, :complete])
  end
end
