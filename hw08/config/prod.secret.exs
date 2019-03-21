use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :hw08, Hw08Web.Endpoint,
  secret_key_base: "2R+BBFe90YT8jzAg7R21TlOZnOa60F7A7AIuDTSf3jIH+H98rwRBfRNyZdFr6M9J"

# Configure your database
config :hw08, Hw08.Repo,
  username: "postgres",
  password: "postgres",
  database: "hw08_prod",
  pool_size: 15
