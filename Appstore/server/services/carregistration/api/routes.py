from .resources import *

def initRoutes(carregistrationPI):
    carregistrationPI.add_resource(apiAdminRegisterCar, '/admin/<int:adminId>')
    carregistrationPI.add_resource(apiCustomerCar, '/admin/<int:customerId>')