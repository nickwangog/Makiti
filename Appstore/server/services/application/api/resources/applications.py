import os, requests, json, hashlib
from api.app import app
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import Application, application_schema, applications_schema
from api.models import ApplicationDeveloper, applicationdeveloper_schema, applicationdevelopers_schema
from api.response import Response as res
import api.serviceUtilities as ServUtil

#   /api/application
#   Adds application to AppStore database
#   Requires in request body to provide: account, app name, files, version, appdescription
#   Example {"accountId": 5, "appName": "Makiti", "versionNumber": "0.01"}
class apiApplication(Resource):
    def get(self):
        queryApps = Application.query.filter_by().all() #active=True
        print(queryApps)
        if not queryApps:
            return res.resourceMissing("No apps in AppStore yet. Brah!")
        return res.getSuccess(data=applications_schema.dump(queryApps).data)

    def post(self):  
        data = request.form
        if not data or not data.get('accountId') or not data.get('appName') or not data.get('versionNumber'):
            return res.badRequestError("Missing data to process request")

        #   Call service to valide account has developer rights
        accountServiceReq = requests.get(app.config['ACCOUNT_SERVICE'] + data.get('accountId')).json()
        if "error" in accountServiceReq["status"]:
            return res.internalServiceError("Acccount service is down.")
        if not accountServiceReq["data"]["developer"]:
            return res.badRequestError("Account not registered as developer.")

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
        linked, msg = ServUtil.addDevelopertoApp(db, { "appid": queryNewApp.id, "accountid" :data.get("accountId")})
        if not linked:
            return res.internalServiceError(msg)

         #   Saves app files
        saved, msg = ServUtil.saveAppinServer(app, file, data)
        if not saved:
            return res.internalServiceError(message=msg)

        #   Call apprequest service to create a request to review just created app
        postRequestData = {'accountid':data.get('accountId'), 'appid':queryNewApp.id, 'requesttype': 1}
        appRequestRes = requests.post(app.config['APPREQUEST_SERVICE'] + "developer", data=postRequestData)
        print(appRequestRes)

        return res.postSuccess("Succesfully created application {}.".format(queryNewApp.appname), application_schema.dump(queryNewApp).data)

#   /api/application/:appId
class apiApplicationbyId(Resource):
    
    def get(self, appId):
        queryApp = Application.query.filter_by(id=appId).first()

        #   Checks application exists in database
        if not queryApp:
            return res.resourceMissing("No application found")

        return res.getSuccess(data=application_schema.dump(queryApp).data)
    
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
