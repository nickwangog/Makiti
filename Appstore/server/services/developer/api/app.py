from flask import Flask, Blueprint
from .config import configure, Database
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)

configure(app, 'test')

db = SQLAlchemy(app)
ma = Marshmallow(app)

developerBP = Blueprint('developer', __name__)
developerAPI = Api(developerBP)

from .routes import initRoutes

#	Initialize Customer API routes
initRoutes(developerBP)

#	Register blueprints
app.register_blueprint(developerBP, url_prefix="/developer")

#	When you need to create a local postgres database for testing
with app.app_context():
    db.create_all()