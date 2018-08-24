import os
from werkzeug.utils import secure_filename
from api.models import apprequest_schema

#   Validates file extension
def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#   Creates the directory for the new app in server file system by joining app name and version number
#   Ilustration of file system for application storage:
#   Apps/
#       + ApplicationName/
#           + 0.1/
#               -appversion0.1.zip
#           + 0.2/
#               -appversion0.2.zip
def saveLoginServer(app, file, data):
    print("saving log into server")
    #   Checks the file received is of valid extension
    filename = secure_filename(file.filename)

    #   Checks if app has a directory created.
    appPath = os.path.join(app.config['UPLOAD_FOLDER'], data["appname"])
    if not os.path.exists(appPath):
        return False, "No folder found for app with name {}".format(data['appname'])
    appversionPath = os.path.join(appPath, data['version'])
    if not os.path.exists(appversionPath):
        return False, "No folder found for version {}.".format(data["version"])
    
    file.save(os.path.join(appversionPath, filename))
    print("saved")
    return True, "File saved!"
