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
    #   Request body should contain accountId, appversionId, appName, requesttype
    #   Example: {"accountId": 14, "appversionId": 3, "requestType" : 1, appName: "whatever", "checksum": "872365"}
    def post(self):
        data = request.get_json()
        #print(data)
        if not data or not data.get("checksum") or not data.get("accountId") or not data.get("appversionId") or not data.get("requestType") or not data.get("appName"):
            return res.badRequestError("Missing data to create app request")
        requestDetails = {"developer": data.get("accountId"), "appversion": data.get("appversionId"), "requesttype": data.get("requestType")}
        appRequest, error = apprequest_schema.load(requestDetails)
        print(appRequest)
        if error:
            return res.internalServiceError(error)
        db.session.add(appRequest)
        db.session.commit()
        
        #   sh run.sh App.zip ya-ya b7709364cb0e7a86416f17fa3ff35b903077e8fa9e94c7e580ad7d57d5a6d509 1
        appandversion = data.get("appName") + "-" + data.get("appversionId")
        cmdRunTestScript = "sh run.sh App.zip {} {} {}".format(appandversion, data.get("checksum"), appRequest.id)
        subprocess.call(cmdRunTestScript)
        
        #   Request Lamines test script
        #   subprocess.check_call(['./run.sh'])
        return res.postSuccess("Request succesfully created.", apprequest_schema.dump(appRequest).data)
    
    #   Request body should contain requestId, status, appDetail
    #   Example {"requestId" : 4, "status": 2, appDetail: "test-1"}
    #   2 = 'success'
    #   3 = 'fail'
    def put(self):
        #print(request.files)
        data = request.form
        print (data)
        if not data or not data["requestId"] or not data["status"] or not data["appDetail"]:
            return res.badRequestError("Missing data to process request.")

        #   Validate app path exists
        appDetail = data["appDetail"]
        appDetail = appDetail.replace('-', '/')
        logStoragePath = os.path.join(app.config['UPLOAD_FOLDER'], appDetail)
        if os.path.exists(logStoragePath) == False:
            return res.internalServiceError("No directory found for {}.".format(appDetail))
        
        queryAppRequest = AppRequest.query.filter_by(id=data["requestId"]).first()
        if not queryAppRequest:
            return res.badRequestError("Request {} does not exist.".format(data["requestId"]))

        #   Call application service to update application version status
        if (data.get("status") == "2"):
            status = 4
        else:
            status = 3
        AppServiceReq = requests.put(app.config['APPLICATION_SERVICE'] + "{}/appversion".format(queryAppRequest.appversion), json={"status": status}).json()
        if ("succss" not in AppServiceReq["status"]):
            return res.internalServiceError("Error in application service. Is it running?")

        #   Saves log file
        saved, msg =  ServUtil.saveLoginServer(app, request.files["logfile"], logStoragePath)
        if not saved:
            return res.internalServiceError(msg)
        
        queryAppRequest.status = data["status"]
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
        fullLogPath = os.path.join(app.config['UPLOAD_FOLDER'], os.path.join(logPath, "test.json"))
        print(fullLogPath)
        if (os.path.exists(fullLogPath) == False):
            return res.badRequestError("Unable to retrieve log file information.")
        return send_file(fullLogPath, attachment_filename="test.json")

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