import gzip
import os
import shutil
import glob

files = glob.glob('/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder/*.gz')
for f in files:
    os.remove(f)

content = "Lots of content here"
sample = open('sample.py', 'r')
sample2 = open('sample2.py', 'r')
samplelines = sample.readlines()
samplelines2 = sample2.readlines()
content2 = ''.join(samplelines)
content3 = ''.join(samplelines2)
f = gzip.open('SAMPLE.log.gz', 'wb')
f.write(content)
f.close()
f2 = gzip.open('SAMPLE1.log.gz', 'wb')
f2.write(content2)
f2.close()
f3 = gzip.open('SAMPLE2.log.gz', 'wb')
f3.write(content3)
f3.close()

shutil.move("/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/SAMPLE.log.gz", "/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder/")
shutil.move("/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/SAMPLE1.log.gz", "/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder/")
shutil.move("/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/SAMPLE2.log.gz", "/nfs/2017/n/nwang/projects/Ford/Appstore/Back_End/Zip_Folder/")