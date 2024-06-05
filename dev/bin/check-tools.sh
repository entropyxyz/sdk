#! /usr/bin/env bash

# QUESTION: do we care about this still?
docker version;
echo "";

if [ $(cat .nvmrc) != $(node --version) ]; then
  echo "INCORRECT NODE VERSION!";
  echo "  expected: $(cat .nvmrc)";
  echo "  running: $(node --version)";
  exit 1;
fi
