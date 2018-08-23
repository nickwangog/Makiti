from .resources import *

def initRoutes(carregistrationAPI):
    carregistrationAPI.add_resource(apiAdminRegisterCar, '/admin/<int:adminId>')
    carregistrationAPI.add_resource(apiRegisterCustomerCar, '/customer/<int:customerId>')
    carregistrationAPI.add_resource(apiCustomerCar, '/caruser/<int:caruserId>')
