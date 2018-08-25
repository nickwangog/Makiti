from flask import Flask, Blueprint
from .config import configure, Database
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)

configure(app, 'test')

db = SQLAlchemy(app)
ma = Marshmallow(app)

accountBP = Blueprint('account', __name__)
accountAPI = Api(accountBP)

from .routes import initRoutes

#	Initialize Account API routes
initRoutes(accountAPI)

#	Register blueprints
app.register_blueprint(accountBP, url_prefix="/account")

#	When you need to create a local postgres database for testing
#with app.app_context():
#    db.create_all()