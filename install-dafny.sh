#!/bin/bash

set -e

VERSION="$1"

if [ -z "$VERSION" ]; then
   echo "No version provided" >&2
   exit 1
fi

cd
wget -O dafny.zip "https://github.com/dafny-lang/dafny/releases/download/v${VERSION}/dafny-${VERSION}-x64-ubuntu-16.04.zip"
unzip dafny.zip
echo "$HOME/dafny" >> "$GITHUB_PATH"
