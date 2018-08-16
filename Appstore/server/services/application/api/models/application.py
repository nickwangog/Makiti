from api.app import db, ma
from datetime import datetime
import sqlalchemy as sa

class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    appname = db.Column(db.String(100), nullable=False)
    appzipb = db.Column(db.LargeBinary)
    approved = db.Column(db.Boolean, nullable=False, server_default=sa.sql.expression.false())
    datecreated = db.Column(db.DateTime, nullable=False, server_default=sa.func.now())
    datelastupdate = db.Column(db.DateTime)
    version = db.Column(db.DECIMAL(10, 2), nullable=False)
    checksum = db.Column(db.Text)
    active = db.Column(db.Boolean, nullable=False, server_default=sa.sql.expression.false())

    def __init__(self, appname, appzipb, version=1):
        self.appname = appname
        self.appzipb = appzipb
        self.version = version

class ApplicationSchema(ma.ModelSchema):
    class Meta:
        model = Application

application_schema = ApplicationSchema()
applications_schema = ApplicationSchema(many=True)