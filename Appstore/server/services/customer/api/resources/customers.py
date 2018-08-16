#import json
#from flask import request
from flask_restful import Resource
#from api.app import db
from api.models import Customer, customer_schema, customers_schema

# #   /api/customer
# class apiCustomer(Resource):
#     None

#   /api/customer/:customerId
class apiCustomerDetails(Resource):
    def get(self, customerId):
        query = Customer.query.filter_by(id=customerId).first()

        if not query:
            return None, 404

        customer, error = customer_schema.dump(query)
        if error:
            return None, 404
        return customer, 201