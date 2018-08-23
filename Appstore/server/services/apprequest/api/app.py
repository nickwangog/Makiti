from flask import Flask, Blueprint
from .config import configure, Database
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)

configure(app, 'test')

db = SQLAlchemy(app)
ma = Marshmallow(app)

apprequestBP = Blueprint('apprequest', __name__)
apprequestAPI = Api(apprequestBP)

from .routes import initRoutes

#	Initialize App Request API routes
initRoutes(apprequestAPI)

#	Register blueprints
app.register_blueprint(apprequestBP, url_prefix="/apprequest")

#	When you need to create a local postgres database for testing
#with app.app_context():
#    db.create_all()