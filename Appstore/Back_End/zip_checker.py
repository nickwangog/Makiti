import glob
import os
import authenticate
import shutil
from zipfile import ZipFile
import ntpath
<<<<<<< HEAD

path ='/appfolder/App.zip'
zip_contents = open('zip_contents.txt', 'w')
log = open('log.txt', 'w')
fail = False

for filename in glob.glob(os.path.join(path, '*.zip')):
   with ZipFile(filename, "r") as zfile:
       for finfo in zfile.infolist():
           if finfo.filename.lower().endswith('.py'):
               ifile = zfile.open(finfo)
               line_list = ifile.readlines()
               zip_contents.write("%s\n" % line_list)
   filename = ntpath.basename(filename)
   res = authenticate.checkZip("zip_contents.txt")
   if res == True:
       log.write(filename + " is validated.\n")
   else:
       fail = True
       log.write(filename + " is invalid.\n")
   open('zip_contents.txt', 'w').close()

if fail == True:
   os.system("exit")
=======
import requests
import sys
path ='/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder'
fail = False

for filename in glob.glob(os.path.join(path, '*.zip')):
    with ZipFile(filename, "r") as zfile:
        with open('zip_contents.txt', 'w') as zip_contents:
            for finfo in zfile.infolist():
                if finfo.filename.lower().endswith('.py'):
                    ifile = zfile.open(finfo)
                    line_list = ifile.readlines()
                    zip_contents.write("%s\n" % line_list)
    filename = ntpath.basename(filename)
    res = authenticate.checkZip("zip_contents.txt")
    with open('log.txt', 'a') as log:
        if res == True:
            log.write(filename + " is validated.\n")
        else:
            fail = True
            log.write(filename + " is invalid.\n")

if fail == True:
    files = {'upload_file': open('log.txt','rb')}
    r = requests.post("10.113.4.18:9924/apprequest/developer", files=files)
    os.system("exit")
>>>>>>> master
