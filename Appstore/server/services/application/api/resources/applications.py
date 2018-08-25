import os, requests, json, hashlib
from api.app import app
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import Application, application_schema, applications_schema
from api.models import ApplicationDeveloper, applicationdeveloper_schema, applicationdevelopers_schema
from api.models import ApplicationVersion, applicationversion_schema, applicationversions_schema
from api.response import Response as res
import api.serviceUtilities as ServUtil

#   /api/application
class apiApplication(Resource):
    #   Retrieves all applications approved and ready for download.
    def get(self):
        queryApps = Application.query.filter_by().all() #active=True
        print(queryApps)
        if not queryApps:
            return res.resourceMissing("No apps in AppStore yet. Brah!")
        return res.getSuccess(data=applications_schema.dump(queryApps).data)

    #   Creates new application.
    #   App is NOT available in AppStore after this proccess. Requires review and testing.
    #   Example {"accountId": 5, "appName": "Makiti", appDesciption: "afgkajfgha"}
    def post(self):
        data = request.get_json()
        print(data)
        if not data or not data.get("accountId") or not data.get("appName"):
            return res.badRequestError("Missing data to process request")

        #   Checks if app name already exists
        query = Application.query.filter_by(appname=data.get('appName')).first()
        if query is not None:
            return res.resourceExistsError("App name {} already taken".format(data.get('appName')))

        #   Validates and saves app data given
        appDetails = {"appname": data.get('appName'), "description": data.get('appDescription')}
        newApp, error = application_schema.load(appDetails)
        if error:
            return res.badRequestError(error)
        db.session.add(newApp)
        db.session.commit()

        #   Add permission to developer over created application
        linked, msg = ServUtil.addDevelopertoApp(db, { "appid": newApp.id, "accountid" :data.get("accountId")})
        if not linked:
            return res.internalServiceError(msg)

        #   Call apprequest service to create a request to review just created app
        #postRequestData = {'accountid':data.get('accountId'), 'appid':queryNewApp.id, 'requesttype': 1}
        #appRequestRes = requests.post(app.config['APPREQUEST_SERVICE'] + "developer", data=postRequestData)
        #if "error" in appRequestRes["status"]:
        #    return res.internalServiceError("App Request Service Error: {}".format(appRequestRes["message"]))
        #print(appRequestRes)

        return  res.postSuccess("Succesfully created application {}.".format(newApp.appname), application_schema.dump(newApp).data)

#   /application/version/:appId/
class apiApplicationVersion(Resource):

    #   Retrieves all app versions submitted for review by developer
    def get(self, appId):
        data = request.get_json()
        
        if not data:
            return res.badRequestError("Missing data to process request.")
        queryApp = Application.query.filter_by(id=appId).first()
        if not queryApp:
            return res.badRequestError("App {} does not exist.".format(appId))
        queryAppVersions = ApplicationVersion.query.filter_by(app=appId).all()
        if not queryAppVersions:
            return res.resourceMissing("No versions found for app {}.".format(queryApp.appname))
        return res.getSuccess(data=applicationversions_schema.dump(queryAppVersions).data)

    #   Stores and creates a version record for the given application.
    #   App is NOT available in AppStore after this proccess. Requires review and testing.
    #   Example {"versionNumber": "0.01", versionDesciption: "afgkajfgha", "checksum" : "string"}
    def post(self, appId):
        data = request.form
        print(data)
        #   Verifies data required was sent in request
        if not data or not data.get("appName") or not data.get("versionNumber") or not data.get("checksum") or not data.get("versionDescription"):
            return res.badRequestError("Missing data to process request.")
        
        #   Verifies app version file was sent in request
        if 'file' not in request.files:
            return res.badRequestError("Missing app file.")
        file = request.files['file']

        checksum = ServUtil.checksum_sha256(file)
        if data.get("checksum") == checksum:
            print("good checksum")
        else:
            return res.badRequestError("File corrupted.")

        #   Verifies app exists
        queryApp = Application.query.filter_by(id=appId).first()
        if not queryApp:
            return res.resourceMissing("App {} not found.".format(appId))
        
        queryAppVersion = ApplicationVersion.query.filter_by(app=appId, version=data.get("versionNumber")).first()
        if queryAppVersion:
            return res.resourceExistsError("Duplicate {} v.{} has already been submitted for review.".format(queryApp.appname, queryAppVersion.version))
        
        #   Validates data and creates application version
        appVersionDetails = {"app": appId, "version": data.get("versionNumber"), "description": data.get("versionDescription")}
        newappVersion, error = applicationversion_schema.load(appVersionDetails)
        if error:
            return res.internalServiceError(error)
        db.session.add(newappVersion)
        db.session.commit()

        #   Saves version files
        saved, msg = ServUtil.saveinAppVersion(app, file, data)
        if not saved:
            return res.internalServiceError(message=msg)
        
        return res.postSuccess("{} v.{} successfully created !".format(queryApp.appname, newappVersion.version), applicationversion_schema.dump(newappVersion).data)

#   /api/application/:appId
class apiApplicationbyId(Resource):
    
    #   Retrieves all data for any specific app
    def get(self, appId):
        queryApp = Application.query.filter_by(id=appId).first()

        #   Checks application exists
        if not queryApp:
            return res.resourceMissing("No application found")

        return res.getSuccess(data=application_schema.dump(queryApp).data)
    
    #   Updates application data (description, icon ...)
    #   Endpoint not for updating version (see )
    #   Requires in request body to provide description, icon. (Only description supported at the moment)
    #   Example {"appDescription": "amazing app to store friends numbers"}
    def put(self, appId):
        data = request.get_json()
        if not data:
            return res.badRequestError("No data provided to update.")
        
        queryApp = Application.query.filter_by(id=appId).first()

        #   Checks application exists in database
        if not queryApp:
            return res.resourceMissing("No application found.")
        
        #   Saves app description (if provided)
        if data.get('description'):
            queryApp.description = data.get('description')

        db.session.commit()
        
        return res.getSuccess("{} successfully updated.".format(queryApp.appname), application_schema.dump(queryApp).data)

    
    def delete(self, appId):
        queryApp = Application.query.filter_by(id=appId).first()
        #   Checks application exists in database
        if not queryApp:
            return res.resourceMissing("No application found.")
        queryApp.active = False
        db.session.commit()
        return res.deleteSuccess("{} succesfully removed from Makiti App Store".format(queryApp.appname), application_schema.dump(queryApp).data)

#   api/application/:appversionId/launch
class apiAppLaunch(Resource):

    #   Makes the app available in the AppStore (if approved)
    #   'Approved' implies it passed all the validation tests performed when app version was submitted by the developer
    def put(self, appversionId):
        queryApp = Application.query.filter_by(id=appversionId).first()

        #   Ensures app exists in database
        if not queryApp:
            return res.resourceMissing("No record with {} found for any app version.".format(appversionId))

        #   Ensures app is approved
        if queryApp.approved is False:
            return res.badRequestError("{} is awaiting for approval.".format(queryApp.appname))
        
        queryApp.active = True
        db.session.commit()

        return res.putSuccess("{} v.{} launched. Now available in MakitiAppStore !".format(queryApp.appname, queryApp.version))

#   api/application/developer/:accountId
class apiDeveloperApps(Resource):

    #   Retrieves all apps developer has permission to update/modify app data
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

#   api/application/:appversionId/appversion
class apiVersion(Resource):
    def get(self, appversionId):
        queryAppVersion = ApplicationVersion.query.filter_by(id=appversionId).first()
        if not queryAppVersion:
            return res.resourceMissing("No version record {} exists.".format(appversionId))
        appVersion, error = applicationversion_schema.dump(queryAppVersion)
        if error:
            return res.internalServiceError(error)
        queryApp = Application.query.filter_by(id=queryAppVersion.app).first()
        if not queryApp:
            return res.resourceMissing("App {} does not exist.".format(queryAppVersion.app))
        appVersion["appDetails"] =  application_schema.dump(queryApp).data
        return res.getSuccess(data=appVersion)