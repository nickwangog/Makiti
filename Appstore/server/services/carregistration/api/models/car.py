from api.app import db, ma
from datetime import datetime

class Car(db.Model):
    __tablename__ = "cars"

    id = db.Column(db.Integer, primary_key=True)
    vin = db.Column(db.Text, nullable=False)
    carmodel = db.Column(db.Integer, nullable=False)
    raspbpi = db.Column(db.Integer, nullable=False)
    registereddate = db.Column(db.Datetime)

    def __init__(self, vin, carmodel, raspbpi):
        self.vin = vin
        self.carmodel = carmodel
        self.raspbpi = raspbpi

class CarSchema(ma.ModelSchema):
    class Meta:
        model = Car

car_schema = CarSchema()
cars_schema = CarSchema(many=True)