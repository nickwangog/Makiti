from api.app import db, ma
from datetime import datetime
import sqlalchemy as sa

class ApplicationDeveloper(db.Model):
    __tablename__ = "applicationdevelopers"

    id = db.Column(db.Integer, primary_key=True)
    appid = db.Column(db.Integer, nullable=False)
    developerid = db.Column(db.Integer, nullable=False)
    active = db.Column(db.Boolean, nullable=False, server_default=sa.sql.expression.true())

    def __init__(self, appid, developerid):
        self.appid = appid
        self.developerid = developerid

class ApplicationDeveloperSchema(ma.ModelSchema):
    class Meta:
        model = ApplicationDeveloper

applicationdeveloper_schema = ApplicationDeveloperSchema()
applicationdevelopers_schema = ApplicationDeveloperSchema(many=True)