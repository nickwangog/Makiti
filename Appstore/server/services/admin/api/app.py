from flask import Flask, Blueprint
from .config import configure, Database
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)

configure(app, 'test')

db = SQLAlchemy(app)
ma = Marshmallow(app)

adminBP = Blueprint('admin', __name__)
adminAPI = Api(adminBP)

from .routes import initRoutes

#	Initialize Customer API routes
initRoutes(adminAPI)

#	Register blueprints
app.register_blueprint(adminBP, url_prefix="/admin")

#	When you need to create a local postgres database for testing
with app.app_context():
    db.create_all()