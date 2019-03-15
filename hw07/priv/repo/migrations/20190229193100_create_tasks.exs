defmodule Tasks1.Repo.Migrations.CreateTasks do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :name, :string, null: false
      add :desc, :string, null: false
      add :complete, :boolean, null: false, default: false
      add :currentlyworking, :boolean, null: false, default: false
      add :currentstart, :naive_datetime, null: true
      add :user_id, references(:users, on_delete: :delete_all), null: false
      timestamps()
    end

  end
end
