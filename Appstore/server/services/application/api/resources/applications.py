import json
import os
from api.app import app
import requests
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import Application, application_schema, applications_schema
from api.models import ApplicationDeveloper, applicationdeveloper_schema, applicationdevelopers_schema
from api.response import Response as res
from werkzeug.utils import secure_filename
ALLOWED_EXTENSIONS = set(['zip', 'gzip'])

def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#   /api/application
#   Requires in request body to provide app: name, zipbinary, version
#   Example {"accountid": 5, "appname": "Makiti", "version": 0.01}
class apiApplication(Resource):
    def post(self):
        
        data = request.form
        print(data)
        print("------------------------------------------")
        print(request.form)
        print("------------------------------------------")
        print(request.files['file'])
        print("------------------------------------------")
        print("doneee")
        if not data or not data.get('accountid') or not data.get('appname') or not data.get('version'):
            return res.badRequestError("Missing data to process request")
        print("checking file")
        query = Application.query.filter_by(appname=data.get('appname')).first()
        if query is not None:
            return res.resourceExistsError("App name {} already taken".format(data.get('appname')))
        
        if 'file' not in request.files:
            return res.badRequestError("Missing app file.")
        file = request.files['file']
        print("file has name :)")
        if file.filename is '':
            return res.badRequestError("No file selected.")
        if file.filename is not 'App.zip'
            return res.badRequestError("File needs to be named 'App.zip'")
        if not file or not allowedFile(file.filename):
            return res.badRequestError("File not supported. Only {} files are supported.".format(ALLOWED_EXTENSIONS))
        print("yes it is!")
        filename = secure_filename(file.filename)
        print("strange shit i dont understand")
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        #   check app name if already exists
        print("file saved!!!!!!!!!!!")
        query = Application.query.filter_by(appname=data.get('appname')).first()
        if query is not None:
            return res.resourceExistsError("App name {} already taken".format(data.get('appname')))
        
        #   Call service to valide account has developer rights

        
        #   Validate data and save application to database
        appdetails = {"appname": data.get('appname'), "appzipb": data.get('appzipb'), "version": data.get('version')}
        newapp, error = application_schema.load(appdetails)
        if error:
            return res.internalServiceError(error)
        db.session.add(newapp)
        db.session.commit()
        query = Application.query.filter_by(appname=data.get('appname')).first()
        if not query:
            return res.internalServiceError("Unable to create application {}.".format(data.get("appname")))
        
        #   Add permission to developer over created application
        appdeveloperdetails = { "appid": query.id, "developerid" :data.get("accountid")}
        newappdeveloper, error = application_schema.load(appdeveloperdetails)
        if error:
            return res.badRequestError(error)
        db.session.add(newappdeveloper)
        db.session.commit()

        #   -------------------
        #   Call service apprequest to create a request to review app
        apprequestRes = requests.post("url to apprequest service")
        #   -------------------

        return res.getSuccess("Succesfully created application.", application_schema.dump(newapp).data)

#   /api/application/:appId
class apiApplicationbyId(Resource):
    
    def get(self, appId):
        query = Application.query.filter_by(id=appId).first()

        #   Checks application exists in database
        if not query:
            return res.resourceMissing("No application found")

        return res.getSuccess(data=application_schema.dump(query).data)
    
    #   Requires in request body to provide app: zipbinary, configfile, version
    #   Example {"appzipb": binary, "version": 0.01}
    def put(self, appId):
        data = request.get_json()
        if not data or not data.get('appzipb') or not data.get('version'):
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
        app.appzipb = data.get('appzipb')
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

#   /api/application/developeradd/:appId
#   Requires in request to provide developer email in request body to allow developer access to the specified app
#   Example: { "developerEmail": whatever@gmail.com }
class apiAddDevelopertoApp(Resource):
    def post(self, developeremail):
        return res.getSuccess()
