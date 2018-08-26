import json
import requests
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import AppRequest, apprequest_schema, apprequests_schema
from api.response import Response as res

#   /api/apprequest/customer/:accountId
#   Runs the process of downloading the specified application to the
#   specified customer car system
#   [POST] method requires in request body applicationId and caruserId
#   Example: {applicationId: 4, caruserId: 34}
class apiCustomerAppRequest(Resource):
    def get(self, accountId):
        queryCustomerApps = AppRequest.query.filter_by(customer=accountId).all()
        if not queryCustomerApps:
            return res.resourceMissing("No apps downloaded by customer {}.".format(accountId))
        return res.getSuccess(apprequests_schema.dump(queryCustomerApps).data)

    def post(self, accountId):
        data = request.get_json()
        print (json.dumps(data, indent=4, sort_keys=True))
        print (data)
        return "fool", 418

        #   Verifies data required is available
        if not data or not data.get("applicationId") or not data.get("caruserId"):
            return res.badRequestError("Missing data to process application download request")
        #   Validates given customer, application, and car registered credentials exist in database
        customerServ = requests.get("http://localhost:9922/account/{}".format(accountId)).content
        print(customerServ)

        apprequestDetails = {}

        # downloading app
