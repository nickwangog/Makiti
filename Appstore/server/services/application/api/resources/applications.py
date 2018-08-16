#import json
from flask import request
from flask_restful import Resource
from api.app import db
from api.models import Application, application_schema, applications_schema
from api.models import ApplicationDeveloper, applicationdeveloper_schema, applicationdevelopers_schema
from api.response import Response as res

#   /api/application
class apiApplication(Resource):
    def post(self):
        data = request.get_json()
        #   checks data has neccesary information to create app before initial review
        return res.getSuccess()

#   /api/application/:appId
class apiApplicationbyId(Resource):
    def get(self, appId):
        query = Application.query.filter_by(id=appId).first()

        if not query:
            return res.resourceMissing("No application found")

        return res.getSuccess(application_schema.dump(query).data)
    
    def put(self, appid):
        #   when updating version
        res.getSuccess()
    
    def delete(self, appid):
        res.getSuccess()


#   /api/application/developeradd/:appId
#   Requires in request to provide developer email in request body to allow developer access to the specified app
#   Example: { "developerEmail": whatever@gmail.com }
class apiAddDevelopertoApp(Resource):
    def post(self, developeremail):
        return res.getSuccess()