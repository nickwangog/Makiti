import os, requests
import json
import urllib
import base64
from io import StringIO
from os import listdir
from os.path import isfile, join
from api.app import app
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import Application, application_schema, applications_schema
from api.models import ApplicationDeveloper, applicationdeveloper_schema, applicationdevelopers_schema
from api.models import ApplicationVersion, applicationversion_schema, applicationversions_schema
from api.response import Response as res
import api.serviceUtilities as ServUtil
from sqlalchemy import or_, and_

#   /api/application
class apiApplication(Resource):
    #   Retrieves all applications approved and ready for download.
    def get(self):
        queryApps = Application.query.filter_by(active=True).all()
        print(queryApps)
        if not queryApps:
            return res.resourceMissing("No apps in AppStore yet. Brah!")
        apps, error = applications_schema.dump(queryApps)
        if error:
            return res.internalServiceError(error)
        for a in apps:
            queryAppVersion = ApplicationVersion.query.filter_by(id=a["runningversion"]).first()
            a["appversionDetails"] = applicationversion_schema.dump(queryAppVersion).data
        return res.getSuccess(data=apps)

    #   Creates new application.
    #   App is NOT available in AppStore after this proccess. Requires review and testing.
    #   Example {"accountId": 5, "appName": "Makiti", appDesciption: "afgkajfgha"}
    def post(self):
        data = request.get_json()
        print(request.files)
        print(data)
        if not data or not data.get("accountId") or not data.get("author") or not data.get("appName"):
            return res.badRequestError("Missing data to process request")

        #   Checks if app name already exists
        query = Application.query.filter_by(appname=data.get('appName')).first()
        if query is not None:
            return res.resourceExistsError("App name {} already taken".format(data.get('appName')))

        #   Validates and saves app data given
        appDetails = {"appname": data.get('appName'), "author": data.get("author"), "description": data.get('appDescription')}
        newApp, error = application_schema.load(appDetails)
        if error:
            return res.badRequestError(error)
        db.session.add(newApp)
        db.session.commit()

        #   Create app directory
        ServUtil.createAppDir(os.path.join(app.config["UPLOAD_FOLDER"], newApp.appname))

        #   Add permission to developer over created application
        linked, msg = ServUtil.addDevelopertoApp(db, { "appid": newApp.id, "accountid" : data.get("accountId")})
        if not linked:
            return res.internalServiceError(msg)

        return  res.postSuccess("Succesfully created application {}.".format(newApp.appname), application_schema.dump(newApp).data)

#   /application/customer/:accountId
class apiCustomerApplications(Resource):
    def get(self, accountId):
        appRequestServ = requests.get(app.config['APPREQUEST_SERVICE'] + "customer/{}".format(accountId)).json()
        print(json.dumps(appRequestServ))
        if "success" not in appRequestServ["status"]:
            return res.internalServiceError("Sorry :(")
        allRequests = appRequestServ["data"]
        applications = []
        for req in allRequests:
            queryAppVersion = ApplicationVersion.query.filter_by(id=req["appversion"]).first()
            queryApp = Application.query.filter_by(id=queryAppVersion.app).first()
            thisapp = application_schema.dump(queryApp).data
            thisapp["appversionDetails"] = applicationversion_schema.dump(queryAppVersion).data
            applications.append(thisapp)

        return res.getSuccess(data=applications)


#   /application/appicon/:appId
class apiApplicationIcon(Resource):
    def get(self, appId):
        print("innnnnnnnnnnnnn")
        # png_output = StringIO()
        # data = png_output.getvalue().encode('base64')
        # data_url = 'data:image/png;base64,{}'.format(urllib.parse.quote(data.rstrip('\n')))
        queryApp = Application.query.filter_by(id=appId).first()
        if not queryApp:
            return res.resourceMissing("App {} does not exist.")
        iconPath = os.path.join(app.config["UPLOAD_FOLDER"], queryApp.appname, "Icon")
        print(iconPath)
        onlyfiles = [f for f in listdir(iconPath) if isfile(join(iconPath, f))]
        if len(onlyfiles) == 0:
            return res.badRequestError("No icons for app {}.".format(appId))
        iconfilePath = os.path.join(iconPath, onlyfiles[0])
        print(iconfilePath)
        with open(iconfilePath, "rb") as imageFile:
            stri = base64.b64encode(imageFile.read())
        return res.getSuccess(data=json.dumps(stri.decode('utf-8')))


#   /application/version/:appId
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
        print(request.files)
        
        #   Verifies data required was sent in request
        if not data or not data.get("appName") or not data.get("versionNumber") or not data.get("checksum") or not data.get("versionDescription"):
            return res.badRequestError("Missing data to process request.")
        
        #   Verifies app version file was sent in request
        if 'file' not in request.files:
            return res.badRequestError("Missing app file.")
        file = request.files['file']

        if "icon" not in request.files:
            return res.badRequestError("Send me an icon.")
        icon = request.files['icon']
        iconPath = os.path.join(app.config["UPLOAD_FOLDER"], data.get("appName"), "Icon")
        print(iconPath)
        saved, msg = ServUtil.saveIcon(icon, iconPath)
        if not saved:
            return res.internalServiceError(msg)

        checksum = ServUtil.checksum_sha256(file)
        
        if data.get("checksum") == checksum:
            print("good checksum")
        else:
            return res.badRequestError("File corrupted.")
        file.seek(0)
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
        queryAppVersion = ApplicationVersion.query.filter_by(id=appversionId).first()
        queryApp = Application.query.filter_by(id=queryAppVersion.app).first()
        #   Ensures app exists in database
        if not queryAppVersion:
            return res.resourceMissing("No record with {} found for any app version.".format(appversionId))
        
        if queryApp.runningversion > queryAppVersion.id:
            return res.badRequestError("Running version > than this version.")
        
        #   Ensures app is approved
        if queryAppVersion.status is not 4:
            print("awaiting to be approved")
            return res.resourceExistsError("App v.{} is still awaiting to be approved.".format(queryAppVersion.version))
        queryApp.runningversion = queryAppVersion.id
        queryAppVersion.status = 2
        queryApp.active = True
        db.session.commit()
        return res.putSuccess("{} v.{} launched. Now available in MakitiAppStore !".format(queryApp.appname, queryAppVersion.version))

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
            queryApplication = Application.query.filter(Application.id==developerapp["appid"]).filter(or_(Application.active==True, and_(Application.active == False, Application.runningversion == 0))).first()
            if queryApplication:
                queryAppVersion = ApplicationVersion.query.filter(ApplicationVersion.app==queryApplication.id).first()
                developerapp["appDetails"] = application_schema.dump(queryApplication).data
                if queryAppVersion:
                    developerapp["appDetails"]["appversionDetails"] = applicationversion_schema.dump(queryAppVersion).data
                allapps.append(developerapp)
        return res.getSuccess(data=allapps)

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
    
    #   Updates status of application version specified
    #   For status meaning see applicationVersion model in api/models/applicationversion
    #   Requires status in request body
    #   Example {"status" : 2}
    def put(self, appversionId):
        data = request.get_json()
        #print (data)
        #print(data["status"])
        print(data.get("status"))
        #   Validates request data
        if not data or not data["status"]:
            return res.badRequestError("Missing data to proccess request.")
        if (int(data.get("status")) < 1 or int(data.get("status")) > 5):
            return res.badRequestError("Invalid status code {}.".format(data["status"]))
        print("passed error")
        #   Verifies app version exists
        queryAppVersion = ApplicationVersion.query.filter_by(id=appversionId).first()
        if not queryAppVersion:
            return res.resourceMissing("No version record {} exists.".format(appversionId))

        queryAppVersion.status = data.get("status")
        queryAppVersion.approved = True
        print(queryAppVersion.status)
        db.session.commit()
        return res.putSuccess("Update version {} status to {}.".format(appversionId, data.get("status")))