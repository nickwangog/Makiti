from .resources import *

def initRoutes(accountAPI):
    accountAPI.add_resource(apiAccount, '/')
    accountAPI.add_resource(apiLogin, '/login')
    accountAPI.add_resource(apiAccountActions, '/<int:accountId>')