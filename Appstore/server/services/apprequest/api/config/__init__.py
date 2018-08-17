from . import dbConfig as Database

def configure(app, configSetting):
    app.config['SQLALCHEMY_DATABASE_URI'] = Database.dbConnection(configSetting)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True