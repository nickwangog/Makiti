import zipfile
from zipfile import ZipFile
import os
import shutil
import glob

files = glob.glob('/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder/*.zip')
for f in files:
    os.remove(f)

f2 = ZipFile('SAMPLE1.zip', 'a')
f2.write("sample.py")
f2.close()
f3 = ZipFile('SAMPLE2.zip', 'a')
f3.write("sample2.py")
f3.close()

shutil.move("/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/SAMPLE1.zip", "/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder/")
shutil.move("/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/SAMPLE2.zip", "/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder/")