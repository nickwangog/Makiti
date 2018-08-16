from .resources import *

def initRoutes(applicationAPI):
    applicationAPI.add_resource(apiApplicationbyId, '/<int:appId>')
    applicationAPI.add_resource(apiApplication, '/')
    applicationAPI.add_resource(apiAddDevelopertoApp, '/developeradd/<int:appId')