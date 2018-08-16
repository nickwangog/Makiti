from .resources import *

def initRoutes(applicationAPI):
    applicationAPI.add_resource(apiCustomerDetails, '/<int:customerId>')