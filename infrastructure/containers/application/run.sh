#!/bin/sh
docker build -t alpine:3.8 . && \
docker run --rm -ti --name "${PWD##*/}" alpine:3.8 /bin/sh