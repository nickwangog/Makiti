from keywords import keywords
import time

log = open('log.txt', 'r+w')
logcheck = log.readlines()
logcheck = [x.strip() for x in logcheck]
# log.truncate(0)
checked = []

def checkFile(s, path):
    fail = 0
    s = [x.strip() for x in s.split(',')]
    for key in keywords:
        for i in range(len(s)):
            if s[i].find(key) != -1:
                if s[i] not in checked:
                    # print type(s)
                    log.write("Restricted code found in line %s\n" % i)
                    log.write("%s\n" % s[i])
                    checked.append(s[i])
                    fail = 1
    if fail == 1:
        return 0
    else:
        return 1

def checkZip(path):
    with open(path, 'r') as test_file:
        line = test_file.readlines()
        line = [x.strip() for x in line]
        for s in line:
            if checkFile(s, path) == 0:
                return 0
    return 1
