#!/bin/sh

shopt -s nullglob dotglob
files=(/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder/*)
if [ ${#files[@]} -gt 0 ]; then
    echo "huzzah"
else
    echo "empty directory"
fi

# $file = 

# if file --mime-type "$file" | grep -q gzip$; then
#   echo "$file is gzipped"
# else
#   echo "$file is not gzipped"
# fi