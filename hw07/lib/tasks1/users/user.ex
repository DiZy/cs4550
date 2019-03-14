defmodule Tasks1.Users.User do
  use Ecto.Schema
  import Ecto.Changeset


  schema "users" do
    field :admin, :boolean, default: false
    field :email, :string
    has_many :tasks, Tasks1.Tasks.Task
    belongs_to :manager, Tasks1.Users.User
    has_many :usersmanaged, Tasks1.Users.User, foreign_key: :manager_id, references: :id
    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :admin])
    |> validate_required([:email, :admin])
  end
end
