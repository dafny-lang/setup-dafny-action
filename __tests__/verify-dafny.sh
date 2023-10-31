#!/usr/bin/env bash

# adapted from
# https://github.com/actions/setup-go/blob/main/__tests__/verify-go.sh

if [ -z "$1" ]; then
  echo "Must supply Dafny version argument" 1>&2
  exit 1
fi

expectedVersionString=$1
version="-version"

if [[ $expectedVersionString = nightly* ]]
then
  echo "Nightly versions do not output a version number that matches the full version string"
	expectedVersionString=""
fi

if [[ $expectedVersionString = 2.3.0 ]]
then
  echo "Version 2.3.0 expects /version"
	version="/version"
fi

echo "Expected Dafny Version: $expectedVersionString"
dafny_version="$(dafny $version)"
echo "Found $dafny_version"
if ! echo "$dafny_version" | grep -qi "Dafny $expectedVersionString"; then
  echo "Unexpected version" 1>&2
  exit 1
fi

# check the DAFNY_VERSION environment variable as well
# (which is more useful when installing nightly versions)

if [[ $expectedVersionString != "" && $DAFNY_VERSION != $expectedVersionString ]]
then
  echo "DAFNY_VERSION not set correctly: $DAFNY_VERSION"
	exit 1
fi