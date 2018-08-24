from api.app import db, ma
from datetime import datetime
import sqlalchemy as sa

class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    appname = db.Column(db.String(200), nullable=False)
    applicationversion = db.Column(db.Integer, nullable=False, server_default='0')
    datecreated = db.Column(db.DateTime, nullable=False, server_default=sa.func.now())
    datelastupdate = db.Column(db.DateTime)
    description = db.Column(db.Text)
    active = db.Column(db.Boolean, nullable=False, server_default=sa.sql.expression.false())

    def __init__(self, appname, description):
        self.appname = appname
        self.description = description
        
class ApplicationSchema(ma.ModelSchema):
    class Meta:
        model = Application

application_schema = ApplicationSchema()
applications_schema = ApplicationSchema(many=True)