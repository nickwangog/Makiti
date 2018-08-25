import glob
import os
import authenticate
import shutil
from zipfile import ZipFile
import ntpath

path ='/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder'
zip_contents = open('zip_contents.txt', 'w')
log = open('log.txt', 'w')

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
        print filename
        log.write(filename + " is validated.\n")
    else:
        print filename    
        log.write(filename + " is invalid.\n")
    open('zip_contents.txt', 'w').close()