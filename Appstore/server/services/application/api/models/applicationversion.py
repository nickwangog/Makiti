from api.app import db, ma
from datetime import datetime
import sqlalchemy as sa

#   Applicationversions table 'status' 
#   status = 1 (deprecated)
#   status = 2 (running)
#   status = 3 (rejected)
#   status = 4 (approved)
#   status = 5 (pending)
#   **Remember to update this when launching

class ApplicationVersion(db.Model):
    __tablename__ = "applicationversions"

    id = db.Column(db.Integer, primary_key=True)
    app = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    version = db.Column(db.String(50), nullable=False)
    approved = db.Column(db.Boolean, nullable=False, server_default=sa.sql.expression.false())
    datecreated = db.Column(db.DateTime, nullable=False, server_default=sa.func.now())
    datelastupdate = db.Column(db.DateTime)
    checksum = db.Column(db.Text)
    status = db.Column(db.Integer, nullable=False, server_default='5')

    def __init__(self, app, version, description):
        self.app = app
        self.version = version
        self.description = description
        
class ApplicationVersionSchema(ma.ModelSchema):
    class Meta:
        model = ApplicationVersion

applicationversion_schema = ApplicationVersionSchema()
applicationversions_schema = ApplicationVersionSchema(many=True)