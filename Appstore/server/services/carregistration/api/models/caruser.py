from api.app import db, ma
from datetime import datetime
import sqlalchemy as sa

class CarUser(db.Model):
    __tablename__ = "carusers"

    id = db.Column(db.Integer, primary_key=True)
    car = db.Column(db.Integer, nullable=False)
    customer = db.Column(db.Integer, nullable=False)
    created = db.Column(db.DateTime, nullable=False, server_default=sa.func.now())

    def __init__(self, car, user):
        self.car = car
        self.user = user

class CarUserSchema(ma.ModelSchema):
    class Meta:
        model = CarUser

caruser_schema = CarUserSchema()
carusers_schema = CarUserSchema(many=True)
