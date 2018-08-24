import glob
import os
import gzip
import shutil
import time
import subprocess
import sys

remoteHost="pi@10.113.100.168"
command="python -i Desktop/ningiford/Appstore/Back_End/zip_checker.py"

ssh = subprocess.Popen(["ssh", "%s" % remoteHost, command],
                       shell=False,
                       stdout=subprocess.PIPE,
                       stderr=subprocess.PIPE)
result = ssh.stdout.readlines()
if result == []:
    error = ssh.stderr.readlines()
    print >>sys.stderr, "ERROR: %s" % error
else:
    print result

yourVar = result 