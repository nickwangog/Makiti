from api.app import db, ma
from datetime import datetime

class Account(db.Model):
    __tablename__ = "admins"

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), nullable=False)

    def __init__(self, firstname, lastname):
        self.firstname = firstname
        self.lastname = lastname

class AdminSchema(ma.ModelSchema):
    class Meta:
        model = Admin

admin_schema = AdminSchema()
admins_schema = AdminSchema(many=True)