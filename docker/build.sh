#!/usr/bin/env bash
# Copyright 2017-2022 @polkadot/apps authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

# fail fast on any non-zero exits
set -e

echo "*** Started building $WEBSERVER_DIR"

if [[ $NODE_ENV != "production" ]]
then
  echo "*** Building $WEBSERVER_DIR"
  docker build --progress=plain \
    --no-cache \
    --build-arg WEBSERVER_DIR=$WEBSERVER_DIR \
    -t $WEBSERVER_DIR \
    -f docker/Dockerfile.dev .
fi

echo "*** Finished building $WEBSERVER_DIR"
