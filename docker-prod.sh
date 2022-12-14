#!/usr/bin/env bash
# Copyright 2017-2022 @polkadot authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

# remove contents of log temporary files
sed -i '' '/^/d' docker.log

PUBLIC_URL=http://localhost:$PORT_PROD

# Build Docker image after setting and exporting environment variables from
# .env file into current shell, then create and run Docker container.
source .env \
    && export APP \
    && export PORT \
    && export PORT_NGINX \
    && export PORT_PROD \
    && NODE_ENV=production PUBLIC_URL=${PUBLIC_URL} ./docker/build.sh \
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
printf "\n*** Open web browser: http://localhost:${PORT_PROD}\n"
