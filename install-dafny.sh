#!/bin/bash

set -e

VERSION="$1"

if [ -z "$VERSION" ]; then
  echo "No version provided" >&2
  exit 1
fi

cd

uname_s=$(uname -s)

os_name="ubuntu-16.04"
if [ "$uname_s" = "Darwin" ]; then
  os_name="osx-10.14.2"
fi

wget -O dafny.zip "https://github.com/dafny-lang/dafny/releases/download/v${VERSION}/dafny-${VERSION}-x64-${os_name}.zip"
unzip dafny.zip
rm dafny.zip
if [ "$uname_s" = "Darwin" ]; then
  ~/dafny/allow_on_mac.sh
fi

echo "$HOME/dafny" >>"$GITHUB_PATH"
