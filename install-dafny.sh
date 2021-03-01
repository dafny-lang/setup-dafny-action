#!/bin/bash

VERSION="$1"

cd
wget -O dafny.zip "https://github.com/dafny-lang/dafny/releases/download/v${VERSION}/dafny-${VERSION}-x64-ubuntu-16.04.zip"
unzip dafny.zip
echo "$HOME/dafny" >> "$GITHUB_PATH"
