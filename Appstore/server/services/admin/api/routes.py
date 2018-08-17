from .resources import *

def initRoutes(adminAPI):
    adminAPI.add_resource(apiAppRequest, '/apprequest')
    adminAPI.add_resource(apiAppRequestAction, '/apprequest/<int:requestId>/action')
    adminAPI.add_resource(apiAppRequests, '/apprequest/<int:appId>')
    adminAPI.add_resource(apiDeveloperRequests, '/apprequest/<int:developerId>')