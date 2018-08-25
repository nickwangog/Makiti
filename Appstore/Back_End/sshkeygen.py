import glob
import os
import gzip
import shutil
import time
import subprocess
import sys


os.system("ssh-keygen -t rsa")
os.system("ssh pi@10.113.100.168 mkdir -p .ssh")
os.system("cat ~/.ssh/id_rsa.pub | ssh pi@10.113.100.168 'cat >> .ssh/authorized_keys'")
os.system("ssh pi@10.113.100.168 'chmod 700 .ssh; chmod 640 .ssh/authorized_keys'")
os.system("ssh pi@10.113.100.168")