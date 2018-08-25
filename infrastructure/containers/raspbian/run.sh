#!/bin/sh
log="$2.json"
touch "$log"
val1=`sha256sum $1 | awk '{print $1}'`
echo $val1
if [ "$val1" = "$3" ]; then
        echo "$(date) : hash file validattion [OK]" >$log
#       curl -X PUT \
#  -F "requestId=$4" \
#  -F "message=File validate succefully" \
#  -F "logfile=@/home/makiti/Documents/Makiti/infrastructure/containers/raspbian/$log" 10.113.4.18:9924/apprequest/developer
else
        curl -X PUT \
  -F "requestId=$4" \
  -F "message=File validate succefully" \
  -F "logfile=@/home/makiti/Documents/Makiti/infrastructure/containers/raspbian/$log" 10.113.4.18:9924/apprequest/developer
        echo "$(date) : hash file validattion [KO]" >$log
        exit 1
fi

docker build -t makiti/pytest --build-arg package=$1 .
docker run -it --rm --name "$2" -v /home/makiti/Documents/Makiti/infrastructure/containers/raspbian:/Validation makiti/pytest
