#!/usr/bin/env bash
# Copyright 2017-2022 @polkadot/apps authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

# Fail fast on any non-zero exits
set -e

echo "*** Started building $APP"

if [[ $NODE_ENV = "production" ]]
then
  echo "*** Building $NODE_ENV $APP"
  docker build --progress=plain --no-cache \
    --build-arg APP=$APP --build-arg PORT_NGINX=$PORT_NGINX --build-arg PUBLIC_URL=$PUBLIC_URL \
    -t $APP -f docker/Dockerfile.prod .
fi

echo "*** Finished building $APP"
