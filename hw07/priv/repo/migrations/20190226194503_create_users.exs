defmodule Tasks1.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string
      add :admin, :boolean, default: false, null: false
      add :manager_id, references(:users, on_delete: :delete_all), null: true

      timestamps()
    end

  end
end
