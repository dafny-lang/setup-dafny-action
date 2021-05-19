#!/usr/bin/env bash

# adapted from
# https://github.com/actions/setup-go/blob/main/__tests__/verify-go.sh

if [ -z "$1" ]; then
  echo "Must supply Dafny version argument" 1>&2
  exit 1
fi

dafny_version="$(dafny /version)"
echo "Found $dafny_version"
if ! echo "$dafny_version" | grep -q "Dafny $1"; then
  echo "Unexpected version" 1>&2
  exit 1
fi
