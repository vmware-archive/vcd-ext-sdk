import sys
import os

# Import pycdlib itself.
import pycdlib

if len(sys.argv) < 1:
    print('Usage: %s' % (sys.argv[0]))
    sys.exit(1)

# Create a new PyCdlib object.
iso = pycdlib.PyCdlib()
iso.new(interchange_level=3)

slash = '/'
for i in range(1, len(sys.argv)):
    name = '/%s' % sys.argv[i].rsplit('/', 1)[-1].replace('-', '_').upper()
    iso.add_file(sys.argv[i], name) 

isoLocation = os.getcwd()
isoLocation += '/archive.iso'
iso.write(isoLocation)
iso.close()
print('%s %s' % ('Created iso', isoLocation))
