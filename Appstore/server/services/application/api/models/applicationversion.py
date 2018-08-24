from api.app import db, ma
from datetime import datetime
import sqlalchemy as sa

class ApplicationVersion(db.Model):
    __tablename__ = "applicationversions"

    id = db.Column(db.Integer, primary_key=True)
    app = db.Column(db.Integer, nullable=False)
    version = db.Column(db.String(50), nullable=False)
    approved = db.Column(db.Boolean, nullable=False, server_default=sa.sql.expression.false())
    datecreated = db.Column(db.DateTime, nullable=False, server_default=sa.func.now())
    datelastupdate = db.Column(db.DateTime)
    description = db.Column(db.Text)
    checksum = db.Column(db.Text)

    def __init__(self, app, version):
        self.app = app
        self.version = version
        
class ApplicationVersionSchema(ma.ModelSchema):
    class Meta:
        model = ApplicationVersion

applicationversion_schema = ApplicationVersionSchema()
applicationversions_schema = ApplicationVersionSchema(many=True)