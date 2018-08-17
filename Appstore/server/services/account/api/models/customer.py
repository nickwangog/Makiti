from api.app import db, ma
from datetime import datetime

class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    carid = db.Column(db.Integer, nullable=False)

    def __init__(self, firstname, lastname, carid):
        self.firstname = firstname
        self.lastname = lastname
        self.carid = carid

class CustomerSchema(ma.ModelSchema):
    class Meta:
        model = Customer

customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)