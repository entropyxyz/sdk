#! /usr/bin/env bash

touch entropy-metadata.json
docker compose --file ./tests/docker-compose.yaml up --detach
ts-node --skip-project node_modules/.bin/polkadot-types-from-defs --package substrate-generated-types/interfaces --input ./substrate-generated-types/interfaces --endpoint ./entropy-metadata.json,
ts-node --skip-project node_modules/.bin/polkadot-types-from-chain --package substrate-generated-types/interfaces --endpoint ./entropy-metadata.json --output ./substrate-generated-types/interfaces,

curl -H \"Content-Type: application/json\" -d '{\"id\":\"1\", \"jsonrpc\":\"2.0\", \"method\": \"state_getMetadata\", \"params\":[]}' http://localhost:9944 > entropy-metadata.json,

docker compose --file ./tests/docker-compose.yaml down