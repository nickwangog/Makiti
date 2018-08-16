#import json
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import Admin, admin_schema, admins_schema
from api.models import AppRequest, apprequest_schema, apprequests_schema
from api.response import Response as res

#   /api/admin/apprequest
#   Request body should contain developerid, appid, requesttype
#   Example: {"developer": 14, "application": 3, "requesttype" : 1}
#   For requesttype: 1 = Create, 2 = Update
class apiAppRequest(Resource):
    def post(self):
        data = request.get_json()
        if not data or not data.get("developer") or not data.get("application") or not data.get("requesttype"):
            return res.badRequestError("Missing data to create app request")
        requestDetails = {"developer" : data.get("developer"), "application": data.get("application"), "requesttype": data.get("requesttype")}
        apprequest, error = apprequest_schema.load(requestDetails)
        if error:
            return res.internalServiceError(error)
        db.session.add(apprequest)
        db.session.commit()
        return res.postSuccess("Request succesfully created.", apprequest_schema.dump(apprequest).data)