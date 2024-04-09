#! /usr/bin/env bash

docker_file=./dev/docker-scripts/$DFO.yaml

docker compose --file $docker_file up --detach

docker compose --file $docker_file down