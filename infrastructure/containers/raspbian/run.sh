#!/bin/sh
log="test.json"
touch "$log"
#val1=`sha256sum $1 | awk '{print $1}'`
val1=`shasum -a 256 $1 | awk '{print $1}'`
echo $val1
if [ "$val1" = "$3" ]; then
        echo "$(date) : $2 hash file validattion [OK]" >$log
#       curl -X PUT \
#  -F "requestId=$4" \
#  -F "status=2" \
#  -F "appDetail=$2" \
#  -F "logfile=@$PWD/$log" 10.113.4.18:9924/apprequest/developer
else
        curl -X PUT \
  -F "requestId=$4" \
  -F "status=3" \
  -F "appDetail=$2" \
  -F "logfile=@"$PWD"/$log" 10.113.4.18:9924/apprequest/developer
        echo "$(date) : $2 hash file validattion [KO]" >$log
        exit 1
fi
echo
echo $1
echo
docker build -t makiti/pytest --build-arg package=$1 --build-arg appname=$2 --build-arg requestId=$4 .
docker run -it --rm --name "$2" -v "$(pwd)":/Validation makiti/pytest
#docker container stop $4