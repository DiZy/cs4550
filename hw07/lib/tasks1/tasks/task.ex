defmodule Tasks1.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset


  schema "tasks" do
    field :name, :string
    field :desc, :string
    field :complete, :boolean
    field :currentlyworking, :boolean
    field :currentstart, :naive_datetime
    belongs_to :user, Tasks1.Users.User
    has_many :timeblocks, Tasks1.Timeblocks.Timeblock
    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:name, :desc, :user_id, :complete, :currentlyworking, :currentstart])
    |> cast_assoc(:user)
    |> validate_required([:name, :desc, :complete])
  end
end
