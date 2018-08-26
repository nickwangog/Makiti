import os
import json, requests
import subprocess
from flask import request, send_file
from flask_restful import Resource
from api.app import app, db
from api.models import AppRequest, apprequest_schema, apprequests_schema
from api.response import Response as res
import api.serviceUtilities as ServUtil

#   /api/apprequest/developer
class apiDeveloperAppReviewRequest(Resource):
    #   Request body should contain developerid, appversionId, requesttype
    #   Example: {"accountId": 14, "appversionId": 3, "requestType" : 1}
    def post(self):
        data = request.get_json()
        #print(data)
        if not data or not data.get("accountId") or not data.get("appversionId") or not data.get("requestType"):
            return res.badRequestError("Missing data to create app request")
        requestDetails = {"developer": data.get("accountId"), "appversion": data.get("appversionId"), "requesttype": data.get("requestType")}
        apprequest, error = apprequest_schema.load(requestDetails)
        print(apprequest)
        if error:
            return res.internalServiceError(error)
        db.session.add(apprequest)
        db.session.commit()

        #   Request Lamines test script
        #   subprocess.check_call(['./run.sh'])
        return res.postSuccess("Request succesfully created.", apprequest_schema.dump(apprequest).data)
    
    #   Request body should contain requestId
    #   Example {"requestId" : 4}
    def put(self):
        #print(request.files)
        data = request.form
        print(data["requestId"])
        queryAppRequest = AppRequest.query.filter_by(id=data["requestId"]).first()
        queryAppRequest.status = data["status"]
        #if not queryAppRequest:
            #return res.badRequestError("Request {} does not exist.".format(data))
        AppServiceReq = requests.get(app.config['APPLICATION_SERVICE'] + "{}/appversion".format(queryAppRequest.appversion)).json() #tmp 2, real queryAppRequest.application
        appData = AppServiceReq["data"]
        print(appData)
        saved, msg =  ServUtil.saveLoginServer(app, request.files["logfile"], appData["appDetails"]["appname"], appData["version"])
        if not saved:
            return res.internalServiceError(msg)
        queryAppRequest.status = 2
        db.session.commit()
        return res.putSuccess(data=apprequest_schema.dump(queryAppRequest).data)

#   /api/apprequest/application/:appversionId
class apiAppRequests(Resource):
    def get(self, appversionId):
        queryRequests = AppRequest.query.filter_by(appversion=appversionId).all()
        if not queryRequests:
            return res.getSuccess(data=None)
        apprequests, error = apprequests_schema.dump(queryRequests)
        if error:
            return res.internalServiceError(error)
        return res.getSuccess("Requests for app {} retrieved".format(appversionId), apprequests)

#   /apprequest/logfile/:logPath
class apiAppRequestLogFile(Resource):
    def get(self, logPath):
        print(logPath)
        logPath = logPath.replace('__', '/')
        print(logPath)
        fullLogPath = os.path.join(app.config['UPLOAD_FOLDER'], os.path.join(logPath, "blah.json"))
        print(fullLogPath)
        if (os.path.exists(fullLogPath) == False):
            return res.badRequestError("Unable to retrieve log file information.")
        return send_file(fullLogPath, attachment_filename="blah.json")

#   /api/apprequest/developer/:developerId
class apiDeveloperRequests(Resource):
    def get(self, developerId):
        query = AppRequest.query.filter_by(developer=developerId).all()
        if not query:
            return res.getSuccess(data=None)
        developerrequests, error = apprequests_schema.dump(query)
        if error:
            return res.internalServiceError(error)
        return res.getSuccess("Requests made by developer {} retrieved".format(developerId), developerrequests)

#   /api/apprequest/:requestId
#   This endpoint is called from admin portal when request is approved, denied, etc.
#   Need to provide action (Integer ranging from (1 - 5)) in body
#   1 = Pending, 2 = Approved, 3 = "Denied", 4 = "Error", 5 = "Corrupted (error, virus)"
#   Example: {"action": 1, comment: "whatever"}
#   comment accepts empty
class apiAppRequest(Resource):
    def get(self, requestId):
        queryAppRequest = AppRequest.query.filter_by(id=requestId).first()
        if not queryAppRequest:
            return res.resourceMissing("No data found for app request #{}.".format(requestId))
        return res.getSuccess(data=apprequest_schema.dump(queryAppRequest).data)

    def put(self, requestId):
        data = request.get_json()
        if not data or not data.get("action"):
            return res.badRequestError("Missing data to proccess action on app request")
        if data.get("action") < 1 or data.get("action") > 5: # ********* too hardcoded change later
            return res.badRequestError("Invalid Action")
        apprequest = AppRequest.query.filter_by(id=requestId).first()
        apprequest.status = data.get("action")
        return res.putSuccess("Succesfully submitted action for request {}.".format(requestId))