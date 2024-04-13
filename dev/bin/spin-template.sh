#! /usr/bin/env bash
source ./dev/bin/ENTROPY_CORE_VERSION.sh
docker_file=./dev/docker-scripts/$1.yaml
# spin up
docker compose --file $docker_file up --detach
# spin down
docker compose --file $docker_file down
docker compose --file $docker_file logs