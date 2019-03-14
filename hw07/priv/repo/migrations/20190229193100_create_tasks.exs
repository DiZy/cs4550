defmodule Tasks1.Repo.Migrations.CreateTasks do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :name, :string, null: false
      add :desc, :string, null: false
      add :minutes, :integer, null: true
      add :complete, :boolean, null: false, default: false
      add :user_id, references(:users, on_delete: :delete_all), null: false
      timestamps()
    end

  end
end
