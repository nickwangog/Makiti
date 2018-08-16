from .resources import *

def initRoutes(customerAPI):
    customerAPI.add_resource(apiAppRequest, '/apprequest')