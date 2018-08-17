from api.app import db, ma
from datetime import datetime

class Developer(db.Model):
    __tablename__ = "developers"

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    company = db.Column(db.String(50))

    def __init__(self, firstname, lastname, company=None):
        self.firstname = firstname
        self.lastname = lastname
        self.company = company

class DeveloperSchema(ma.ModelSchema):
    class Meta:
        model = Developer

developer_schema = DeveloperSchema()
developers_schema = DeveloperSchema(many=True)