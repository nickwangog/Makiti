#!/bin/bash

    echo "File unziped succefully [OK]" > test.json
unzip App.zip
if [ $? -eq 0 ]
then
    curl -X PUT \
     -F "requestId=$4" \
     -F "status=2" \
     -F "appDetail=$2" \
     -F "logfile=@$PWD/$log" 10.113.4.18:9924/apprequest/developer
        echo 'text to append' >> test.json
    echo "$(date) : File unziped fail check file [KO]" >> test.json
    echo "The script ran ok"
    exit 0
else
    echo "$(date) : File unziped fail check file[KO]" >> test.txt
    echo "The script failed" >&2
    exit 1
fi
# unzip App.zip -d /appfolder 2>/dev/null |
# [[ $? -eq 0 ]]&&echo "Compessed file" || echo "Not compressed"