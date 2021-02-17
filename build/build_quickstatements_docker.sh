#!/bin/bash
set -ex

mkdir -p Docker/build/QuickStatements/artifacts
cp "$TARBALL_PATH" Docker/build/QuickStatements/artifacts/

docker build --pull Docker/build/QuickStatements/ -t "$1"
docker save "$1" | gzip -"$GZIP_COMPRESSION_RATE"f > artifacts/"$1".docker.tar.gz