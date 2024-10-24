#! /usr/bin/env bash
source ./dev/bin/ENTROPY_CORE_VERSION.sh

FILE="dev/docker-scripts/$1.yaml"

spin_up() {
  docker compose --file "$FILE" "$@" up --detach

  if [ $? -ne 0 ]; then
    echo "Error: 'docker compose up' failed."
    echo "Retrying verbose:"
    docker compose --file "$FILE" up --detach
  fi
}

if [ -n "$GITHUB_WORKSPACE" ]; then
  spin_up --progress quiet --quiet-pull
else
  spin_up --progress quiet
fi
