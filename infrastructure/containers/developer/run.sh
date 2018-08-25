#!/bin/sh
docker build -t "${PWD##*/}"/alpine:3.8 . && \
docker run -ti --name "${PWD##*/}" --rm -v /nfs/2017/l/lkaba/Desktop/kaba/piscine/42/makiti/Appstore/server/services/developer:developer/app "${PWD##*/}"/alpine:3.8 /bin/sh