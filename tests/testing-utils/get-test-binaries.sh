#!/bin/sh
curl -H "Authorization: token $GH_TOKEN" -H 'Accept: application/octet-stream' 'https://github.com/entropyxyz/entropy-core/releases/download/v0.0.7/entropy' -o testing-utils/test-binaries/entropy && chmod a+x testing-utils/test-binaries/entropy
curl -H "Authorization: token $GH_TOKEN" -H 'Accept: application/octet-stream' 'https://github.com/entropyxyz/entropy-core/releases/download/v0.0.7/server' -o testing-utils/test-binaries/server && chmod a+x testing-utils/test-binaries/server
