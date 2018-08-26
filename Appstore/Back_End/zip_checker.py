import glob
import os
import authenticate
import shutil
from zipfile import ZipFile
import ntpath

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