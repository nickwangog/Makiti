#!/bin/sh
docker run --name postgres-mki --restart always -e POSTGRES_PASSWORD=Makiti@2019 -e POSTGRES_USER=dmontoya -d -p 5432:5432 postgres:10.4-alpine

#docker exec -it postgres-mki /bin/bash