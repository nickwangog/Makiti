from .resources import *

def initRoutes(customerAPI):
    customerAPI.add_resource(apiCustomerDetails, '/<int:customerId>')