#!/usr/local/bin/python

# change above line to point to local 
# python executable

import urllib, urlparse, string, time
 

# create URL with desired search parameters

url = "http://archive.stsci.edu/pointings/search.php?"
url = url + "primary=ACS&outputformat=CSV"
url = url + "&pnt_ucountp=%3C5&pnt_icountp=%3E1&bao=and"
url = url + "&galactic=Above&galsearch=75"
url = url + "&action=Search+Exposures"

print url

# retrieve URL and  write results to filename

filename = "out_py.txt"

urllib.urlretrieve(url,filename)

### Done!

Donated by Martin Still from the Kepler GO Office: Extracts metadata from the Kepler archive. A shell command like this: KepInvestigationAtMAST.py --invid=STKL --quarter=1 will list all quarter 1 data ingested so far from the KASC LC program. One can use this in a cron job to monitor the incremental ingestion of GO data after each quarter and notify the GOs when their data is available. it can also be used to track data release dates.

#!/usr/bin/env python

import getopt, sys, urllib, time

def main():

    status = 0

# input arguments

    try:
    opts, args = getopt.getopt(sys.argv[1:],"h:iq",
                   ["help","invid=","quarter="])
    except getopt.GetoptError:
    usage()
    tree = False
    for o, a in opts:
    if o in ("-h", "--help"):
        usage()
    if o in ("-i", "--invid"):
        invid = str(a)
    if o in ("-q", "--quarter"):
        quarter = int(a)

    kepid, invid, kepmag, mode, start, stop, release = GetMetaData(invid,quarter)

# convert Gregorian date to Julian date

def Greg2JD(year, month, day):

    if (month < 3):
        y = float(year) - 1.0
        m = float(month) + 12.0
    else:
        y = float(year)
        m = float(month)
    a = 0; b = 0
    if (y + m / 12 + float(day) / 365 > 1582.87166):
        a = int(y / 100)
        b = 2 - a + int(float(a / 4))
    c = 0
    if (y < 0.0):
        c = int(365.25 * y - 0.75)
    else:
        c = int(365.25 * y)
    d = int(30.6001 * (m + 1))
    jd = float(b + c + d + day + 1720994.5);

    return jd

# start and stop Julian dates for Kepler quarters

def QuarterDates(quarter):

    Qstart = [2454953.5,2454964.5,2454998.5]
    Qstop  = [2454962.5,2454997.5,2455100.5]
    if (quarter < len(Qstart)):
        return Qstart[quarter] - 10, Qstop[quarter] + 10
    else:
        message  = 'No spacecraft roll dates recorded for quarter ' + str(quarter) + '.\n'
        message += 'Find an updated script at http://keplergo.arc.nasa.gov'
        sys.exit(message)

def GetMetaData(invid,quarter):

# get start and stop dates for quarter

    Qstart, Qstop = QuarterDates(quarter)