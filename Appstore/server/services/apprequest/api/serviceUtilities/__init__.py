import os
import paramiko
import socket
from api.config import sshCredentials
from werkzeug.utils import secure_filename
from api.models import apprequest_schema
ALLOWED_EXTENSIONS = set(['json'])

#   Validates file extension
def allowedFile(filename):
    print(filename)
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#   Saves App Review Log File in app directory
def saveLoginServer(app, file, logPath):
    print("saving log into server")
    print(file)
    if not file or not allowedFile(file.filename):
        return False, "File not supported. Only {} extensions are supported.".format(ALLOWED_EXTENSIONS)
    #   Checks the file received is of valid extension
    filename = secure_filename(file.filename)

    #   Checks if app has a directory created.
    if not os.path.exists(logPath):
        return False, "No folder found for app with name {}".format(logPath)
    
    file.save(os.path.join(logPath, filename))
    print("saved")
    return True, "File saved!"