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

filename=dafny-${VERSION}-x64-${os_name}.zip
if [ "$VERSION" = "2.3.0" ]; then
  filename="dafny-2.3.0.10506-x64-${os_name}.zip"
elif [ "$VERSION" = "2.2.0" ]; then
  filename="dafny-2.2.0.10923-x64-${os_name}.zip"
fi

wget -O dafny.zip "https://github.com/dafny-lang/dafny/releases/download/v${VERSION}/$filename"
unzip dafny.zip
rm dafny.zip

echo "$HOME/dafny" >>"$GITHUB_PATH"
