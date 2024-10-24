#! /usr/bin/env bash

rm -rf .entropy
./dev/bin/spin-down.sh four-nodes
./dev/bin/spin-down.sh one-node-no-tss
