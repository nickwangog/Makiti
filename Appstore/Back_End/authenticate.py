from keywords import keywords
import time

log = open('log.txt', 'a')
checked = []

def checkFile(s, path):
    global checked
    fail = False
    s = [x.strip() for x in s.split(',')]
    s = [x.strip(']') for x in s]
    s = [x.strip('\'') for x in s]    
    for key in keywords:
        for i in range(len(s)):
            if s[i].find(key) != -1:
                if s[i] not in checked:
                    log.write("Restricted code found in line %s\n" % i)
                    log.write("%s\n" % s[i])
                    checked.append(s[i])
                    fail = True
    if fail == True:
        return False
    else:
        return True

def checkZip(path):
    fail = False
    with open(path, 'r') as test_file:
        line = test_file.readlines()
        line = [x.strip() for x in line]
        for s in line:
            res = checkFile(s, path)
            if res == False:
                fail = True
    if fail == True:
        return False
    else:
        return True
