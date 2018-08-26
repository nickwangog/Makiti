from api.app import db, ma
from datetime import datetime
import sqlalchemy as sa

#   apprequest table 'status' 
#   status = 1 (pending)
#   status = 2 (test successful, pending approval)
#   status = 3 (test unsuccesful)
#   status = 4 (approved)

class AppRequest(db.Model):
    __tablename__ = "apprequests"

    id = db.Column(db.Integer, primary_key=True)
    appversion = db.Column(db.Integer, nullable=False)
    customer = db.Column(db.Integer, nullable=False, server_default='0')
    car = db.Column(db.Integer, nullable=False, server_default='0')
    developer = db.Column(db.Integer, nullable=False, server_default='0')
    admincomment = db.Column(db.Text)
    dateclosed = db.Column(db.DateTime)
    datecreated = db.Column(db.DateTime, server_default=sa.func.now())
    status = db.Column(db.Integer, nullable=False, server_default='1')
    requesttype = db.Column(db.Integer, nullable=False)

    def __init__(self, requesttype, appversion, customer=0, car=0, developer=0):
        self.appversion = appversion
        self.customer = customer
        self.car = car
        self.developer = developer
        self.requesttype = requesttype

class AppRequestSchema(ma.ModelSchema):
    class Meta:
        model = AppRequest

apprequest_schema = AppRequestSchema()
apprequests_schema = AppRequestSchema(many=True)