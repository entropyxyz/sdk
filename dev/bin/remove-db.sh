#! /usr/bin/env bash

rm -rf .entropy
docker compose --file dev/docker-scripts/four-nodes.yaml --progress quiet down
docker compose --file dev/docker-scripts/one-node-no-tss.yaml --progress quiet down
