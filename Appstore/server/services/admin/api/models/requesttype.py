from api.app import db, ma

class RequestType(db.Model):
    __tablename__ = "requesttypes"
    
    id = db.Column(db.Integer, primary_key=True)
    requesttype = db.Column(db.String(40), nullable=False)

    def __init__(self, requesttype):
        self.requesttype = requesttype