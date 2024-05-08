#! /usr/bin/env bash
printf "SPIN UP\n"
source ./dev/bin/ENTROPY_CORE_VERSION.sh
# DFO is place holder put the docker script here
docker_file=dev/docker-scripts/$1.yaml

docker compose --file $docker_file up --detach

