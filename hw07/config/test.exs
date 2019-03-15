use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :tasks1, Tasks1Web.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :tasks1, Tasks1.Repo,
  username: "david",
  password: "davidpass",
  database: "tasks2",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
