import json
import requests
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import AppRequest, apprequest_schema, apprequests_schema
from api.response import Response as res

#   /api/apprequest/customer/:customerId
#   Runs the process of downloading the specified application to the
#   specified customer car system
#   [POST] method requires in request body applicationId and caruserId
#   Example: {applicationId: 4, caruserId: 34}
class apiCustomerAppRequest(Resource):
    def post(self, customerId):
        data = request.get_json()
        #   Verifies data required is available
        if not data or not data.get("applicationId") or not data.get("caruserId"):
            return res.badRequestError("Missing data to process application download request")
        #   Validates given customer, application, and car registered credentials exist in database
        customerServ = requests.get("http://localhost:9922/account/{}".format(customerId)).content
        print(customerServ)
        applicationServ = requests.get("http://localhost:9923/application/{}".format(data.get("applicationId"))).content
        print(applicationServ)
        carregServ = requests.get("http://localhost:9925/carregistration/caruser/{}".format(data.get("caruserId"))).content
        print(carregServ)

        # downloading app
