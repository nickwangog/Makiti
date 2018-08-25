from api.app import db, ma
from datetime import datetime
import sqlalchemy as sa

class ApplicationReview(db.Model):
    __tablename__ = "applicationreviews"

    id = db.Column(db.Integer, primary_key=True)
    apprequest = db.Column(db.String(100), nullable=False)
    logfile = db.Column(db.LargeBinary, nullable=False)
    datecreated = db.Column(db.DateTime, nullable=False, server_default=sa.func.now())

    def __init__(self, apprequest, logfile):
        self.apprequest = apprequest
        self.logfile = logfile


class ApplicationReviewSchema(ma.ModelSchema):
    class Meta:
        model = ApplicationReview

applicationreview_schema = ApplicationReviewSchema()
applicationreviewss_schema = ApplicationReviewSchema(many=True)