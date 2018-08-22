import json
import requests
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import AppRequest, apprequest_schema, apprequests_schema
from api.response import Response as res

#   /api/apprequest/customer/:customerId
class apiCustomerAppRequest(Resource):
    def post(self, customerId):
        data = request.get_json()
        if not data or not data.get("applicationId") or not data.get("carId"):
            return res.badRequestError("Missing data to process application download request")
        requests.get("urltocustomer service")
        requests.get("urltocarregistration service")