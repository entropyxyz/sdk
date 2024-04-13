#! /usr/bin/env bash


# pull meta data write to file
curl -H "Content-Type: application/json" -d '{"id":"1", "jsonrpc":"2.0", "method": "state_getMetadata", "params":[]}' http://127.0.0.1:9944 > entropy-metadata.json &&
# generate types

# node --experimental-specifier-resolution=node --loader ts-node/esm  node_modules/.bin/polkadot-types-from-defs --package dscp-matchmaker-api/interfaces --input ./node_modules/@polkadot/types/ --endpoint ./entropy-metadata.json &&
# node --experimental-specifier-resolution=node --loader ts-node/esm  node_modules/.bin/polkadot-types-from-chain --endpoint ./entropy-metadata.json --output ./substrate-generated-types/interfaces

# "generate:defs":
ts-node --skip-project node_modules/.bin/polkadot-types-from-defs --package ./node_modules/@polkadot/types/ --input ./substrate-generated-types --endpoint entropy-metadata.json &&
# "generate:meta":
ts-node --skip-project node_modules/.bin/polkadot-types-from-chain --package ./node_modules/@polkadot/types/ --endpoint entropy-metadata.json --output ./substrate-generated-types