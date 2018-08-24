from . import dbConfig as Database
UPLOAD_FOLDER = "/nfs/2017/d/dmontoya/Apps"
APPREQUEST_SERVICE = "localhost:9924/apprequest"
ACCOUNT_SERVICE = "localhost:9922/account"
CARREGISTRATION_SERVICE = "localhost:"

def configure(app, configSetting):
    app.config['APPREQUEST_SERVICE'] = APPREQUEST_SERVICE
    app.config['ACCOUNT_SERVICE'] = ACCOUNT_SERVICE
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['SQLALCHEMY_DATABASE_URI'] = Database.dbConnection(configSetting)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True