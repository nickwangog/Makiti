import json
import subprocess
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import AppRequest, apprequest_schema, apprequests_schema
from api.response import Response as res

#   /api/apprequest/developer
#   Request body should contain developerid, appid, requesttype
#   Example: {"developer": 14, "application": 3, "requesttype" : 1}
#   For requesttype: 1 = Create, 2 = Update
class apiDeveloperAppReviewRequest(Resource):
    def post(self):
        data = request.get_json()
        if not data or not data.get("developer") or not data.get("application") or not data.get("requesttype"):
            return res.badRequestError("Missing data to create app request")
        requestDetails = {"developer" : data.get("developer"), "application": data.get("application"), "requesttype": data.get("requesttype")}
        apprequest, error = apprequest_schema.load(requestDetails)
         #  Request Lamines test script
        subprocess.check_call(['./run.sh'])
        if error:
            return res.internalServiceError(error)
        db.session.add(apprequest)
        db.session.commit()
        return res.postSuccess("Request succesfully created.", apprequest_schema.dump(apprequest).data)

#   /api/apprequest/application/:appId
class apiAppRequests(Resource):
    def get(self, appId):
        query = AppRequest.query.filter_by(application=appId).all()
        if not query:
            return res.getSuccess(data=None)
        apprequests, error = apprequests_schema.dump(query)
        if error:
            return res.internalServiceError(error)
        return res.getSuccess("Requests for app {} retrieved".format(appId), apprequests)

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
    
    #   Handles submit app to app store
    def post(self, requestId):
        #   Call apprequest 