#! /usr/bin/env bash
source ./dev/bin/ENTROPY_CORE_VERSION.sh
# create entropy metadata file
touch entropy-metadata.json
# spin up single node
docker_file=./dev/docker-scripts/one-node-no-tss.yaml
docker compose --file $docker_file up --detach
# pull meta data write to file
curl -H \"Content-Type: application/json\" -d '{\"id\":\"1\", \"jsonrpc\":\"2.0\", \"method\": \"state_getMetadata\", \"params\":[]}' http://localhost:9944 > entropy-metadata.json,
# generate types

ts-node --skip-project node_modules/.bin/polkadot-types-from-defs --package substrate-generated-types/interfaces --input ./substrate-generated-types/interfaces --endpoint ./entropy-metadata.json
ts-node --skip-project node_modules/.bin/polkadot-types-from-chain --package substrate-generated-types/interfaces --endpoint ./entropy-metadata.json --output ./substrate-generated-types/interfaces

# spin down node
docker compose --file $docker_file down
docker compose --file $docker_file logs