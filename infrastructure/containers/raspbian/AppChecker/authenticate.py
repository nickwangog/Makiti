from keywords import keywords
import time
path ='/appfolder'
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
                    with open('{}/{}'.format(path, 'test.json'), 'a') as log:
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
