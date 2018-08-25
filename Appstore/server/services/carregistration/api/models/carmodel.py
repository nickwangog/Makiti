from api.app import db, ma

class CarModel(db.Model):
    __tablename__ = "carmodels"

    id = db.Column(db.Integer, primary_key=True)
    cartype = db.Column(db.String(100))
    model = db.Column(db.String(100))
    year = db.Column(db.Integer)
    description = db.Column(db.Text)

    def __init__(self, cartype, model, year, description=""):
        self.cartype = cartype
        self.model = model
        self.year = year
        self.description = description

class CarModelSchema(ma.ModelSchema):
    class Meta:
        model = CarModel

carmodel_schema = CarModelSchema()
carmodels_schema = CarModelSchema(many=True)