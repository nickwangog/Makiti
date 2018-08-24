from . import dbConfig as Database
UPLOAD_FOLDER = "/nfs/2017/d/dmontoya/Apps"

def configure(app, configSetting):
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['SQLALCHEMY_DATABASE_URI'] = Database.dbConnection(configSetting)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True