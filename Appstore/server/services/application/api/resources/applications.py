import os, requests, json, hashlib
from api.app import app
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import Application, application_schema, applications_schema
from api.models import ApplicationDeveloper, applicationdeveloper_schema, applicationdevelopers_schema
from api.response import Response as res
from werkzeug.utils import secure_filename
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
def saveAppinServer(file, data):
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
def addDevelopertoApp(appDeveloperDetails):
    #   Validates data given is complete and ready to save to database
    newappdeveloper, error = applicationdeveloper_schema.load(appDeveloperDetails)
    if error:
        return False, error
    db.session.add(newappdeveloper)
    db.session.commit()
    return True, "Developer linked!"

#   /api/application
#   Adds application to AppStore database
#   Requires in request body to provide: account, app name, files, version, appdescription
#   Example {"accountId": 5, "appName": "Makiti", "versionNumber": "0.01"}
class apiApplication(Resource):
    def post(self):  
        data = request.form
        if not data or not data.get('accountId') or not data.get('appName') or not data.get('versionNumber'):
            return res.badRequestError("Missing data to process request")

        #   Call service to valide account has developer rights
        accountServiceReq = requests.get(os.path.join(app.config['ACCOUNT_SERVICE']), "{}".format(data.get('accountId'))).content
        print(accountServiceReq)
        return res.getSuccess("hey")

        #   Checks if app name already exists
        query = Application.query.filter_by(appname=data.get('appName')).first()
        if query is not None:
            return res.resourceExistsError("App name {} already taken".format(data.get('appName')))
        
        #   Checks file was sent in request
        if 'file' not in request.files:
            return res.badRequestError("Missing app file.")
        file = request.files['file']

        #   Validate app data given and saves to database if it is correct
        appdetails = {"appname": data.get('appName'), "version": data.get('versionNumber'), "description": data.get('description')}
        newapp, error = application_schema.load(appdetails)
        if error:
            return res.badRequestError(error)
        db.session.add(newapp)
        db.session.commit()
        queryNewApp = Application.query.filter_by(appname=data.get('appName')).first()
        
        #   Verifies app was created succesfully in the daatabase
        if not queryNewApp:
            return res.internalServiceError("Unable to create application {}.".format(data.get("appName")))
        
        #   Add permission to developer over created application
        linked, msg = addDevelopertoApp({ "appid": queryNewApp.id, "accountid" :data.get("accountId")})
        if not linked:
            return res.internalServiceError(msg)

         #   Saves app files
        saved, msg = saveAppinServer(file, data)
        if not saved:
            return res.internalServiceError(message=msg)

        #   Call apprequest service to create a request to review just created app
        postRequestData = {'accountid':data.get('accountId'), 'appid':queryNewApp.id, 'requesttype': 1}
        appRequestRes = requests.post(os.path.join(app.config['APPREQUEST_SERVICE'], "developer"), data=postRequestData)
        print(appRequestRes)

        return res.postSuccess("Succesfully created application {}.".format(queryNewApp.appname), application_schema.dump(queryNewApp).data)

#   /api/application/:appId
class apiApplicationbyId(Resource):
    
    def get(self, appId):
        query = Application.query.filter_by(id=appId).first()

        #   Checks application exists in database
        if not query:
            return res.resourceMissing("No application found")

        return res.getSuccess(data=application_schema.dump(query).data)
    
    #   Requires in request body to provide app: zipbinary, configfile, version
    #   Example {"version": 0.01}
    def put(self, appId):
        data = request.get_json()
        if not data or not data.get('version'):
            return res.badRequestError("Missing data to process request")
        
        app = Application.query.filter_by(id=appId).first()

        #   Checks application exists in database
        if not app:
            return res.resourceMissing("No application found")
        if data.get('version') <= app.version:
            return res.badRequestError("Version {} provided is less than current version {}".format(data.get('version'), app.version))
        app.version = data.get('version')
        #   -----------------
        #   Call service to validate security of binary
        requests.post("url to servicevalidate binary")
        #   -----------------
        app.checksum = "hey" # replace with the return of the call service to validate binary

        db.session.commit()
        
        #   -------------------
        #   Call service apprequest to create a request to review app
        apprequestRes = requests.post("url to apprequest service")
        #   -------------------
        
        return res.getSuccess("{} data uploaded successfully.".format(app.appname))

    
    def delete(self, appId):
        app = Application.query.filter_by(id=appId).first()

        #   Checks application exists in database
        if not app:
            return res.resourceMissing("No application found")
        app.active = False
        db.session.commit()
        res.deleteSuccess("{} succesfully removed from Makiti App Store".format(app.appname))

#   api/application/:appId/launch
class apiAppLaunch(Resource):
    def put(self, appId):
        app = Application.query.filter_by(id=appId).first()

        #   Ensure app exists in database
        if not app:
            return res.resourceMissing("No application found")

        #   Ensure app is approved
        if app.approved is False:
            return res.badRequestError("{} is awaiting for approval from Makiti.".format(app.appname))
        
        app.active = True
        db.session.commit()

        return res.putSuccess("{} v.{} succesfully launched. Available in MakitiAppStore".format(app.appname, app.version))

#   api/application/developer/:accountId
class apiDeveloperApps(Resource):
    def get(self, accountId):
        queryDeveloperApp = ApplicationDeveloper.query.filter_by(accountid=accountId).all()
        if not queryDeveloperApp:
            return res.resourceMissing("No apps for developer with account {} found.".format(accountId))
        developerapps, error = applicationdevelopers_schema.dump(queryDeveloperApp)
        if error:
            return res.internalServiceError(error)
        allapps = []
        for developerapp in developerapps:
            queryApplication = Application.query.filter_by(id=developerapp["appid"]).first()
            developerapp["appDetails"] = application_schema.dump(queryApplication).data
            allapps.append(developerapp)
        return res.getSuccess("Succesful [GET]", allapps)

#   /api/application/developeradd/:appId
#   Requires in request to provide developer email in request body to allow developer access to the specified app
#   Example: { "developerEmail": whatever@gmail.com }
class apiAddDevelopertoApp(Resource):
    def post(self, developeremail):
        return res.getSuccess()
