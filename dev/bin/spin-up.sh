#! /usr/bin/env bash
source ./dev/bin/ENTROPY_CORE_VERSION.sh

docker_file=dev/docker-scripts/$1.yaml
if [ $GITHUB_WORKSPACE ]; then
  docker compose --file $docker_file up --detach --quiet-pull;
else
  docker compose --file $docker_file up --detach --quiet-pull;
fi
