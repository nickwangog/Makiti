from .resources import *

def initRoutes(applicationAPI):
    applicationAPI.add_resource(apiApplicationbyId, '/<int:appId>')
    applicationAPI.add_resource(apiApplication, '/')
    applicationAPI.add_resource(apiAppLaunch, '/<int:appversionId>/launch')
    #applicationAPI.add_resource(apiAddDevelopertoApp, '/developeradd/<int:appId>')
    applicationAPI.add_resource(apiDeveloperApps, '/developer/<int:accountId>')
    applicationAPI.add_resource(apiApplicationVersion, '/version/<int:appId>')
    applicationAPI.add_resource(apiVersion, '/<int:appversionId>/appversion')