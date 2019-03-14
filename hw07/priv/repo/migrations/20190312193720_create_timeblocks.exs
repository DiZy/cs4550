defmodule Tasks1.Repo.Migrations.CreateTimeblocks do
  use Ecto.Migration

  def change do
    create table(:timeblocks) do
      add :start, :naive_datetime, null: false
      add :end, :naive_datetime, null: false
      add :task_id, references(:tasks, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:timeblocks, [:task_id])
  end
end
