#! /usr/bin/env bash

RESULT=$(grep -r \
  --exclude-dir=dev \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  'test\.only'
)

if [ "$RESULT" ]; then
  RED='\033[0;31m'
  NC='\033[0m' # No Color

  printf "${RED}Error: test.only found${NC} \n" && \
  grep -rn \
    --exclude-dir=dev \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --color \
    'test\.only' && \
  echo '' && \
  echo 'Please remove ♡' && \
  echo '' && \
  exit 1
fi
