#!/bin/sh
docker build -t "${PWD##*/}"/alpine:3.8 . && \
docker run -ti --name "${PWD##*/}" --restart always "${PWD##*/}"/alpine:3.8 /bin/sh