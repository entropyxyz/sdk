#! /usr/bin/env bash

rm -rf .entropy
docker compose --file dev/docker-scripts/four-nodes.yaml down 2> /dev/null
docker compose --file dev/docker-scripts/two-nodes.yaml down 2> /dev/null
docker compose --file dev/docker-scripts/one-node-no-tss.yaml down 2> /dev/null
