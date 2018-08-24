import os
from werkzeug.utils import secure_filename
from api.models import applicationdeveloper_schema
ALLOWED_EXTENSIONS = set(['zip', 'gzip'])

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
def saveAppinServer(app, file, data):
    print("saving into server")
    #   Checks the file received is of valid extension
    if not file or not allowedFile(file.filename):
        return False, "File not supported. Only {} extensions are supported.".format(ALLOWED_EXTENSIONS)
    filename = secure_filename(file.filename)

    #   Checks if app has a directory created already.
    appPath = os.path.join(app.config['UPLOAD_FOLDER'], data.get('appName'))
    if os.path.exists(appPath):
        return False, "An app with name {} already exists.".format(data.get('appName'))
    appversionPath = os.path.join(appPath, data.get('versionNumber'))
    if os.path.exists(appversionPath):
        return False, "App version {} already exists.".format(data.get('versionNumber'))
    
    #   Creates directory in server file system and saves application
    os.makedirs(appversionPath, 0o777)
    file.save(os.path.join(appversionPath, filename))
    return True, "File saved!"

#   Links developer and app, giving him permission to modify app details and make requests
def addDevelopertoApp(db, appDeveloperDetails):
    #   Validates data given is complete and ready to save to database
    newappdeveloper, error = applicationdeveloper_schema.load(appDeveloperDetails)
    if error:
        return False, error
    db.session.add(newappdeveloper)
    db.session.commit()
    return True, "Developer linked!"