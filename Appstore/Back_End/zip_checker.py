import glob
import os
import authenticate
import shutil
from zipfile import ZipFile

# os.system("pip install --upgrade pip")
path ='/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder'
list_of_zips = open('test.txt', 'r+w')
contents = list_of_zips.readlines()
contents = [x.strip() for x in contents]
zip_contents = open('zip_contents.txt', 'r+w')

for filename in glob.glob(os.path.join(path, '*.zip')):
    if filename not in contents:
        list_of_zips.write("%s\n" % filename)
        with ZipFile(filename, "r") as zfile:
            for finfo in zfile.infolist():
                ifile = zfile.open(finfo)
                line_list = ifile.readlines()
                zip_contents.write("%s\n" % line_list)
            if authenticate.checkFile("zip_contents.txt") == 1:
                print ("installed " + filename)
            # os.system("pip install " + filename)
            # for name in f.namelist():
            #     data = f.read(name)
            #     zip_contents.write("%s\n" % str(data))
        # with ZipFile(filename, 'r') as f:
        #     # f.printdir()
        #     print filename
        #     f = f.read(filename)
        #     # file_content = f.read()
        #     zip_contents.write("%s\n" % f)
        #     f.close()
        #     if authenticate.checkFile("zip_contents.txt") == 1:
        #         # os.system("pip install " + filename)
        #         print ("installed " + filename)