from flask import request
from flask_restful import Resource
from api.app import db
from api.models import Account, account_schema, accounts_schema
from api.response import Response as res


#   /account/
#   Account creation [POST]
#   Requires in request body: first name, last name, username, password
#   Example {"firstname":"Dago", "lastname":"Burrito", "username": "dagoburrito", "password": "473689gjfdfs"}
class apiAccount(Resource):
    def post(self):
        data = request.get_json()
        if not data or not data.get("firstname") or not data.get("lastname") or not data.get("username") or not data.get("password"):
            return res.badRequestError("Missing information to process account creation.")
        
        #   check username is unique
        query = Account.query.filter_by(username=data.get("username")).first()
        if query:
            return res.resourceExistsError("Username {} already taken.".format(data.get("username")))
        
        newAccountDetails = {"firstname": data.get("firstname"), "lastname": data.get("lastname"), "username": data.get("username"), "password": data.get("password") }
        newAccount, error = account_schema.load(newAccountDetails)
        if error:
            return res.internalServiceError(error)
        db.session.add(newAccount)
        db.session.commit()
        return res.postSuccess("Account succesfully created for username {}.".format(newAccount.username), newAccount)

#   /api/account/login
#   Requires in request body: username, password
#   Example {"username": "dagoburrito", "password": "473689gjfdfs"}
class apiLogin(Resource):
    def post(self):
        #   Verifying request body is not empty
        data = request.get_json()
        if not data or not data.get("username") or not data.get("password"):
            return res.badRequestError("Missing information to login user.")
        
        #   Verifies user exists in database
        query = Account.query.filter_by(username=data.get("username"), password=data.get("password")).first()
        if not query:
            return res.badRequestError("Incorrect login information.")
        return res.postSuccess(data=account_schema.dump(query).data)

#   /api/account/:accountId
#   For method ["PUT"]:
#   - Requires details to be updated in request body. See account model for reference of columns in database.
#   Example { "developer": 1 } 1 = true, 0 = false
class apiAccountActions(Resource):
    def get(self, accountId):
        query = Account.filter_by(id=accountId).first()
        if not query:
            return res.resourceMissing("No account with id {} was found.".format(accountId))
        return res.getSuccess(account_schema.dump(query).data)
    
    def put(self, accountId):
        data = request.get_json()
        if not data:
            return res.badRequestError("No data to update for account {}.".format(accountId))
        
        queryAccount = Account.query.filter_by(id=accountId).first()
        if not queryAccount:
            return res.resourceMissing("No account with id {} was found.".format(accountId))
        if data.get("customer"):
            queryAccount.customer = not queryAccount.customer
            db.session.commit()
            return res.putSuccess("Account {} has customer priviledges.".format(accountId))
        if data.get("developer"):
            queryAccount.developer = not queryAccount.developer
            db.session.commit()
            return res.putSuccess("Account {} has developer priviledges.".format(accountId))
        if data.get("admin"):
            queryAccount.admin = not queryAccount.admin
            db.session.commit()
            return res.putSuccess("Account {} has admin priviledges.".format(accountId))
        return res.badRequestError("No data to update for account {}.".format(accountId))

    def delete(self, accountId):
        queryAccount = Account.query.filter_by(id=accountId).first()
        if not queryAccount:
            return res.resourceMissing("No account with id {} was found.".format(accountId))
        queryAccount.active = False
        db.session.commit()
        return res.deleteSuccess("Account {} deleted.".format(accountId))
