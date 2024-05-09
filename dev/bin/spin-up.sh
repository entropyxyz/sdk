#! /usr/bin/env bash
source ./dev/bin/ENTROPY_CORE_VERSION.sh

env

docker_file=dev/docker-scripts/$1.yaml
docker compose --file $docker_file up --detach --quiet-pull
