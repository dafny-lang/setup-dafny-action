#!/usr/bin/env bash

# adapted from
# https://github.com/actions/setup-go/blob/main/__tests__/verify-go.sh

if [ -z "$1" ]; then
  echo "Must supply Dafny version argument" 1>&2
  exit 1
fi

input=$1
version="-version"

if [[ $input = nightly* ]]
then
  echo "Nightly versions do not output a version number"
	input=""
fi

if [[ $input = 2.3.0 ]]
then
  echo "Version 2.3.0 expects /version"
	version="/version"
fi

echo "Expected Dafny Version: $input"
dafny_version="$(dafny $version)"
echo "Found $dafny_version"
if ! echo "$dafny_version" | grep -q "Dafny $input"; then
  echo "Unexpected version" 1>&2
  exit 1
fi
