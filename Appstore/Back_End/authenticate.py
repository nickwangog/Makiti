from keywords import keywords

log = open('log.txt', 'r+w')
logcheck = log.readlines()
logcheck = [x.strip() for x in logcheck]
# log.truncate(0)

def checkLine(s, line_number, path):
    for key in keywords:
        if s.find(key) != -1:
            #check if duplicate
            print logcheck
            if s not in logcheck:
                log.write("Restricted code found in line %s\n" % line_number)
                log.write("%s\n" % s)
            return 0
    return 1

def checkFile(path):
    with open(path, 'r') as test_file:
        line = test_file.readlines()
        line = [x.strip() for x in line]
        i = 0
        for s in line:
            i += 1
            if checkLine(s, i, path) == 0:
                return 0
    return 1
