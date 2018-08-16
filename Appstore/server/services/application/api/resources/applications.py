#import json
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import Application, application_schema, applications_schema
from api.models import ApplicationDeveloper, applicationdeveloper_schema, applicationdevelopers_schema
from api.response import Response as res

#   /api/application
#   Requires in request body to provide app: name, zipbinary, version
#   Example {"appname": "Makiti", "appzipb": binary, "version": 0.01}
class apiApplication(Resource):
    def post(self):
        data = request.get_json()
        if not data or not data.get('appname') or not data.get('appzipb'):
            return res.badRequestError("Missing data to process request")
        #   check app name if already exists
        query = Application.query.filter_by(appname=data.get('appname')).first()
        if query is not None:
            return res.resourceExistsError("App name {} already taken".format(data.get('appname')))
        
        #   -----------------
        #   Call service to validate security of binary
        #   -----------------

        appdetails = {"appname": data.get('appname'), "appzipb": data.get('appzipb'), "version": data.get('version')}
        newapp, error = application_schema.load(appdetails)
        if error:
            return res.internalServiceError(error)
        db.session.add(newapp)
        db.session.commit()
        return res.getSuccess("Succesfully created application.", application_schema.dump(newapp).data)

#   /api/application/:appId
class apiApplicationbyId(Resource):
    
    def get(self, appId):
        query = Application.query.filter_by(id=appId).first()

        #   Checks application exists in database
        if not query:
            return res.resourceMissing("No application found")

        return res.getSuccess(application_schema.dump(query).data)
    
    #   Requires in request body to provide app: zipbinary, version
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
        #   -----------------
        app.appzipb = data.get('appzipb')
        app.checksum = "hey" # replace with the return of the call service to validate binary
        db.session.commit()
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

        return res.putSuccess("{} v.{} succesfully launched. Details in MakitiAppStore".format(app.appname, app.version))

#   /api/application/developeradd/:appId
#   Requires in request to provide developer email in request body to allow developer access to the specified app
#   Example: { "developerEmail": whatever@gmail.com }
class apiAddDevelopertoApp(Resource):
    def post(self, developeremail):
        return res.getSuccess()