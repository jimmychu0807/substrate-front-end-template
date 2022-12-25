#!/usr/bin/env bash
# Copyright 2017-2022 @polkadot authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

trap "echo; exit" INT
trap "echo; exit" HUP

NODE_ENV=production

source .env \
    && export ADDRESS APP PORT PORT_NGINX PORT_PROD \
    && PUBLIC_URL="${ADDRESS}:${PORT_PROD}" \
    && NODE_ENV=${NODE_ENV} PUBLIC_URL=${PUBLIC_URL} ./docker/build.sh \
    && printf "\n*** Started building ${NODE_ENV} Docker container. Please wait... \n***" \
    && docker run -it -d --name "${APP}-prod" ${APP} \
        -e NODE_ENV=${NODE_ENV} -e PORT_NGINX=${PORT_NGINX} -e PUBLIC_URL=${PUBLIC_URL} \
        -p ${PORT_PROD}:${PORT_NGINX}

printf "\n*** Finished building ${NODE_ENV} Docker container. Please open: ${PUBLIC_URL}\n"
