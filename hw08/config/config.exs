# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :hw08,
  ecto_repos: [Hw08.Repo]

# Configures the endpoint
config :hw08, Hw08Web.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "O1KOdRzZC7aOxVuX2qKj4HKtwoyjk9aIgyeKLUNP01+9tuzSMU+KQtg/jspdwsXN",
  render_errors: [view: Hw08Web.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Hw08.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
