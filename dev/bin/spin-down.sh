#! /usr/bin/env bash
source ./dev/bin/ENTROPY_CORE_VERSION.sh

FILE="dev/docker-scripts/$1.yaml"

spin_down() {
  docker compose --file "$FILE" --progress quiet down "$@"

  if [ $? -ne 0 ]; then
    echo "Error: 'docker compose down' failed."
    echo "Retrying verbose:"
    docker compose --file "$FILE" down
  fi
}

spin_down
docker compose --file $FILE logs
