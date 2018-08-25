from . import dbConfig as Database
UPLOAD_FOLDER = "/nfs/2017/d/dmontoya/Apps"
ACCOUNT_SERVICE = "http://localhost:9922/account/"
APPLICATION_SERVICE = "http://localhost:9923/application/"
CARREGISTRATION_SERVICE = "localhost:"

def configure(app, configSetting):
    app.config['ACCOUNT_SERVICE'] = ACCOUNT_SERVICE
    app.config['APPLICATION_SERVICE'] = APPLICATION_SERVICE
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['SQLALCHEMY_DATABASE_URI'] = Database.dbConnection(configSetting)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True