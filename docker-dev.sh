#!/usr/bin/env bash
# Copyright 2017-2022 @polkadot authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

# tell bash to early exit script if receive interrupt signal SIGINT and SIGHUP
# https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_12_01.html 
trap "echo; exit" INT
trap "echo; exit" HUP
# Build Docker image after setting and exporting environment variables from
# .env file into current shell, then create and run Docker container.
source .env \
    && export APP \
    && export PORT \
    && ./docker/build.sh \
    && printf "\n*** Started building Docker container." \
    && printf "\n*** Please wait... \n***" \
    && DOCKER_BUILDKIT=0 docker compose -f docker-compose-dev.yml up --build

printf "\n*** Finished building Docker container."
printf "\n*** Open web browser: http://localhost:${PORT}\n"
