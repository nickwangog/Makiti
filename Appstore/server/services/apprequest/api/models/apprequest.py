from api.app import db, ma
from datetime import datetime
import sqlalchemy as sa

class AppRequest(db.Model):
    __tablename__ = "apprequests"

    id = db.Column(db.Integer, primary_key=True)
    requesttype = db.Column(db.Integer, nullable=False)
    application = db.Column(db.Integer, nullable=False)
    customer = db.Column(db.Integer, nullable=False, server_default='0')
    developer = db.Column(db.Integer, nullable=False, server_default='0')
    admin = db.Column(db.Integer, nullable=False, server_default='0')
    dateclosed = db.Column(db.DateTime)
    datecreated = db.Column(db.DateTime, server_default=sa.func.now())
    status = db.Column(db.Integer, nullable=False, server_default='1')
    admincomment = db.Column(db.Text)

    def __init__(self, requesttype, application, customer=0, developer=0):
        self.requesttype = requesttype
        self.application = application
        self.customer = customer
        self.developer = developer

class AppRequestSchema(ma.ModelSchema):
    class Meta:
        model = AppRequest

apprequest_schema = AppRequestSchema()
apprequests_schema = AppRequestSchema(many=True)