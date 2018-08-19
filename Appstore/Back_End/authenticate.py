from keywords import keywords


def checkLine(s, line_number, path):
    for key in keywords:
        if s.find(key) != -1:
            print "Restricted code found in line", line_number, "of", path
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
