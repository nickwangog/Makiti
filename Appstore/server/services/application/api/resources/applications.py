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

#   /api/application/:appid
class apiApplicationbyId(Resource):
    def get(self, appid):
        query = Application.query.filter_by(id=appid).first()

        if not query:
            return res.resourceMissing("No application found")

        return res.getSuccess(application_schema.dump(query).data)
    
    def put(self, appid):
        #   when updating version
        a = 1
    
    def delete(self, appid):
        a = 1


#   /api/application/:developeremail
class apiAddDevelopertoApp(Resource):
    def post(self, developeremail):
        return res.getSuccess()