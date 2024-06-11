#! /usr/bin/env bash

# HACK: normally we could just go:
#   tape tests/*.test.ts | tap-spec
#
# but here we are fighting TS ... this works well enough

ONLY_FILES=`grep 'test.only' tests/*.test.ts -l`

if [ $ONLY_FILES ]; then
  # If there are files with test.only, run only those files
  # NOTE: `yarn test:only` ensures our CI fails if those are left in
  set -e;
  for t in $ONLY_FILES; do
    npx tsx $t | tap-spec;
  done
else
  # Otherwise run all tests
  set -e;
  for t in tests/*.test.ts; do
    npx tsx $t | tap-spec;
  done
fi
