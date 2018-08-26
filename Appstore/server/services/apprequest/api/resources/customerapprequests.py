import os
import json
import requests
from . import ssh
from flask import request
from flask_restful import Resource
from api.app import db, app
from api.models import AppRequest, apprequest_schema, apprequests_schema
from api.response import Response as res
import api.serviceUtilities as ServUtils

#   /api/apprequest/customer/:accountId
class apiCustomerAppRequest(Resource):
    #   Retrieves app download requests by customer
    def get(self, accountId):
        queryCustomerApps = AppRequest.query.filter_by(customer=accountId).all()
        if not queryCustomerApps:
            return res.resourceMissing("No apps downloaded by customer {}.".format(accountId))
        return res.getSuccess(apprequests_schema.dump(queryCustomerApps).data)
    
    #   Downloads the specified application on the specified customer car
    #   Requires in request body applicationId and caruserId
    #   Example: {applicationId: 4, caruserId: 34}
    def post(self, accountId):
        data = request.get_json()
        print (json.dumps(data, indent=4, sort_keys=True))

        #   Verifying required data is available to proccess request
        if not data or not data.get("appDetails") or not data.get("accountDetails") or not data.get("carDetails"):
            return res.badRequestError("Missing data to process request.")
        dataAppDetails = data.get("appDetails")
        dataAppVersionDetails = dataAppDetails["appversionDetails"]
        dataAccountDetails = data.get("accountDetails")
        dataCarDetails = data.get("carDetails")
        if not dataAppDetails or not dataAppVersionDetails or not dataAccountDetails or not dataCarDetails:
            return res.badRequestError("Missing data to process request.")

        #   Finding requested app package in server
        appReqDownloadPath = os.path.join(app.config["UPLOAD_FOLDER"], os.path.join(dataAppDetails["appname"], dataAppVersionDetails["version"], "App.zip"))
        print("download path!! {}".format(appReqDownloadPath))
        if os.path.exists(appReqDownloadPath) == False:
            print("wrong path")
            return res.badRequestError("App executable files not found.")

        #   Connect to client vehicle device
        remoteAppDirectory =  os.path.join(app.config["PI_REMOTE_DIR"], dataAppDetails["appname"])
        error, sshI = ssh.SSHconnect(app.config["PI_IP"], 22)
        if error < 0:
            return res.internalServiceError(sshI)
        
        print(os.path.exists(remoteAppDirectory))
        #   Download and Install app in remote device
        ssh.createAppDirectory(sshI, remoteAppDirectory)
        ssh.sendFile(sshI, appReqDownloadPath, os.path.join(remoteAppDirectory, "App.zip"))
        ssh.installApp(sshI, os.path.join(remoteAppDirectory, "App.zip"), "HelloWorld.py")
        print (sshI)

        #   Saves customer download request
        apprequestDetails = {"requesttype": 3, "appversion": dataAppVersionDetails["id"], "customer": accountId, "car": dataCarDetails["id"]}
        customerAppRequest, error = apprequest_schema.load(apprequestDetails)
        if error:
            return res.internalServiceError(error)
        customerAppRequest.status = 5   # sets status as download request
        db.session.add(apprequestDetails)
        db.session.commit()

        return res.postSuccess("App installation successful.")

