import os
import paramiko
import socket
from api.config import sshCredentials
from werkzeug.utils import secure_filename
from api.models import apprequest_schema
ALLOWED_EXTENSIONS = set(['log'])

#   Validates file extension
def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#   Saves App Review Log File in app directory
def saveLoginServer(app, file, appName, appVersion):
    print("saving log into server")
    
    if not file or not allowedFile(file.filename):
        return False, "File not supported. Only {} extensions are supported.".format(ALLOWED_EXTENSIONS)
    #   Checks the file received is of valid extension
    filename = secure_filename(file.filename)

    #   Checks if app has a directory created.
    appPath = os.path.join(app.config['UPLOAD_FOLDER'], appName)
    if not os.path.exists(appPath):
        return False, "No folder found for app with name {}".format(appName)
    appversionPath = os.path.join(appPath, appVersion)
    if not os.path.exists(appversionPath):
        return False, "No folder found for version {}.".format(appVersion)
    
    file.save(os.path.join(appversionPath, filename))
    print("saved")
    return True, "File saved!"

def SSSHconnect(host, portNbr):
    try:
        ssh = paramiko.SSHClient()
        print ("1")
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print ("2")
# was trying to add banner_timeout because it seems to have that failure
# occasionally. Couldn't get it working.
#        ssh.connect(host, port=portNum, username=sshUserName,
#            password=sshPassword, pkey=None, key_filename=None,
#            timeout=3.0, allow_agent=True, look_for_keys=True,
#            compress=False, sock=None, gss_auth=False, gss_kex=False,
#            gss_deleg_creds=True, gss_host=None, banner_timeout=5.0)
        print ("hostname = ", host)
        print ("port = ", portNbr)
        print ("sshUsername = ", sshCredentials.sshUsername)
        print ("sshPassword = ", sshCredentials.sshPassword)

        ssh.connect(hostname=host, port=portNbr, username=sshCredentials.sshUsername, password=sshCredentials.sshPassword)
        print ("3")
        ssh.get_transport().window_size = 3 * 1024 * 1024
        print ("4")
    except paramiko.AuthenticationException:
        print ("Authentication failed!")
        return -1
    except paramiko.BadHostKeyException:
        print ("BadHostKey Exception!")
        return -1
    except paramiko.SSHException:
        print ("SSH Exception!")
        ssh.close()
        return -2
    except socket.error as e:
        print ("Socket error ", e)
        return -1
    except:
        print ("Could not SSH to %s, unhandled exception" % host)
    print ("Made connection to " + host + ":" + str(portNbr))
    return (ssh)

