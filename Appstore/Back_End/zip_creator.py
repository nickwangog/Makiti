import gzip
import os
import shutil

content = "Lots of content here"
sample = open('sample.py', 'r')
sample2 = open('sample2.py', 'r')
samplelines = sample.readlines()
samplelines2 = sample2.readlines()
content2 = ''.join(samplelines)
content3 = ''.join(samplelines2)
f = gzip.open('Onlyfinnaly.log.gz', 'wb')
f.write(content)
f.close()
f2 = gzip.open('SAMPLE1.log.gz', 'wb')
f2.write(content2)
f2.close()
f3 = gzip.open('SAMPLE2.log.gz', 'wb')
f3.write(content3)
f3.close()

os.rename("path/to/current/file.foo", "path/to/new/destination/for/file.foo")
shutil.move("path/to/current/file.foo", "path/to/new/destination/for/file.foo")