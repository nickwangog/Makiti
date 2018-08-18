from .resources import *

#   All endpoints available for this service
def initRoutes(apprequestAPI):
    apprequestAPI.add_resource(apiAppRequest, '/')
    apprequestAPI.add_resource(apiAppRequestAction, '/<int:requestId>/action')
    apprequestAPI.add_resource(apiAppRequests, '/<int:appId>')
    apprequestAPI.add_resource(apiDeveloperRequests, '/<int:developerId>')