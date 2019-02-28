defmodule Tasks1.Repo do
  use Ecto.Repo,
    otp_app: :tasks1,
    adapter: Ecto.Adapters.Postgres
end
