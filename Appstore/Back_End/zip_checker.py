import glob
import os
import authenticate
import gzip
import shutil

path ='/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder'
list_of_zips = open('test.txt', 'r+w')
contents = list_of_zips.readlines()
contents = [x.strip() for x in contents]
zip_contents = open('zip_contents.txt', 'r+w')

for filename in glob.glob(os.path.join(path, '*.gz')):
    if filename not in contents:
        list_of_zips.write("%s\n" % filename)
        f = gzip.open(filename, 'r')
        file_content = f.read()
        zip_contents.write("%s\n" % file_content)
        f.close()
        if authenticate.checkFile("zip_contents.txt") == 1:
             print ("installed " + filename)
            #install it 
   
# print(contents)