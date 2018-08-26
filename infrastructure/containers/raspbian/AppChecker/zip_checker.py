import glob
import os
import authenticate
import shutil
from zipfile import ZipFile
import ntpath
import sys
import datetime

path ='/appfolder'
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
    with open('{}/{}'.format(path, 'test.json'), 'a') as log:
        print("RES", res)
        if res == True:
            log.write(str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")) + " "+ str(sys.argv[1]) + " code parsing [OK]\n")

        else:
            fail = True
            log.write(filename + " is invalid.\n")
if fail == True:
    files = {'upload_file': open('test.json','rb')}
    # r = requests.post("10.113.4.18:9924/apprequest/developer", files=files)
    os.system("exit")