#!/bin/bash

# set the download URLs for the entropy and server binaries
ENTROPY_URL_BINARY="https://entropy.family/testing-utils/test-binaries/entropy"
SERVER_URL_BINARY="https://entropy.family/testing-utils/test-binaries/server"

# set the output directory for the downloaded binaries
OUTPUT_DIR="$(dirname "$0")/../testing-utils/test-binaries"

# create the output directory if it doesn't exist
if [ ! -d "$OUTPUT_DIR" ]; then
    mkdir -p "$OUTPUT_DIR"
fi

# download the entropy binary if it doesn't exist
if [ ! -f "$OUTPUT_DIR/entropy" ]; then
    curl -o "$OUTPUT_DIR/entropy" "$ENTROPY_URL_BINARY"
    chmod +x "$OUTPUT_DIR/entropy"
    echo "Entropy binary downloaded and made executable. In direction: $OUTPUT_DIR"
else
    echo "Entropy binary already exists in the project."
fi

# download the server binary if it doesn't exist
if [ ! -f "$OUTPUT_DIR/server" ]; then
    curl -o "$OUTPUT_DIR/server" "$SERVER_URL_BINARY"
    chmod +x "$OUTPUT_DIR/server"
    echo "Server binary downloaded and made executable. in directory: $OUTPUT_DIR"
else
    echo "Server binary already exists in the project."
fi
