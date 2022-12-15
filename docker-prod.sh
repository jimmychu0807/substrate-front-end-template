#!/usr/bin/env bash
# Copyright 2017-2022 @polkadot authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

trap "echo; exit" INT
trap "echo; exit" HUP
source .env \
    && export ADDRESS \
    && export APP \
    && NODE_ENV=production \
    && export PORT \
    && export PORT_NGINX \
    && export PORT_PROD \
    && PUBLIC_URL="${ADDRESS}:${PORT_PROD}" \
    && NODE_ENV=${NODE_ENV} PUBLIC_URL=${PUBLIC_URL} ./docker/build.sh \
    && printf "\n*** Started building ${NODE_ENV} Docker container." \
    && printf "\n*** Please wait... \n***" \
    && docker run -it \
        -e NODE_ENV=${NODE_ENV} \
        -e PORT_NGINX=${PORT_NGINX} \
        -e PUBLIC_URL=${PUBLIC_URL} \
        -d \
        -p ${PORT_PROD}:${PORT_NGINX} \
        --name "${APP}-prod" ${APP}

printf "\n*** Finished building ${NODE_ENV} Docker container."
printf "\n*** Open web browser: ${PUBLIC_URL}\n"
