# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Hw08.Repo.insert!(%Hw08.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Hw08.Repo
alias Hw08.Users.User
alias Hw08.Tasks.Task

pwhash = Argon2.hash_pwd_salt("pass1")

Repo.insert!(%User{email: "alice@example.com", admin: true, password_hash: pwhash})
Repo.insert!(%User{email: "bob@example.com", admin: false, password_hash: pwhash})
Repo.insert!(%Task{name: "task1forbob", desc: "desc", minutes: 15, user_id: 2, complete: true})