#!/bin/sh
docker build -t "${PWD##*/}"/alpine:3.8 . && \
docker run -ti --name "${PWD##*/}" --restart always -p 9924:9924 "${PWD##*/}"/alpine:3.8 /bin/sh