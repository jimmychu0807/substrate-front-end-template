#!/usr/bin/env bash
# Copyright 2017-2022 @polkadot authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

trap "echo; exit" INT
trap "echo; exit" HUP
source .env \
    && export APP PORT \
    && printf "\n*** Started building Docker container. Please wait... \n***" \
    && DOCKER_BUILDKIT=0 docker compose -f docker-compose-dev.yml up --build -d
printf "\n*** Finished building Docker container. Please open: http://localhost:${PORT}\n"
