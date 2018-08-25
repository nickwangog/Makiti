from .resources import *

#   All endpoints available for this service
def initRoutes(apprequestAPI):
    apprequestAPI.add_resource(apiDeveloperAppReviewRequest, '/developer')
    apprequestAPI.add_resource(apiAppRequests, '/application/<int:appId>/')
    apprequestAPI.add_resource(apiAppRequest, '/<int:requestId>')
    apprequestAPI.add_resource(apiDeveloperRequests, '/developer/<int:developerId>')
    apprequestAPI.add_resource(apiCustomerAppRequest, '/customer/<int:accountId>')
    apprequestAPI.add_resource(apiAppRequestLogFile, '/logfile/<logPath>')