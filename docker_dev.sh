#!/usr/bin/env bash


# Build Docker image after setting and exporting environment variables from
# .env file into current shell, then create and run Docker container
source .env \
    && export WEBSERVER_DIR \
    && bash ./docker/build.sh \
    && DOCKER_BUILDKIT=0 docker compose -f docker-compose-dev.yml up --build
