from flask import request
from flask_restful import Resource
from api.app import db
from api.models import Car, car_schema, cars_schema
from api.models import CarUser, caruser_schema, carusers_schema
from api.models import CarModel, carmodel_schema, carmodels_schema
from api.response import Response as res

#   api/carregistration/admin/:adminId
#   Requires data in request body for 'POST' method
#   Example: {"vin": "A3446Ksfa", carmodel": 15, "raspbpi": 293}  (carmodel id and raspberrypi id in database)
class apiAdminRegisterCar(Resource):
    def post(self, adminId):
        #   Verifying data required was given
        data = request.get_json()
        if not data or not data.get("vin") or not data.get("carmodel") or not data.get("raspbpi"):
            return res.badRequestError("Missing data to process POST request.")
        
        #   Verifying vin number is not duplicated
        queryvin = Car.query.filter_by(vin=data.get("vin")).first()
        if queryvin:
            return res.resourceExistsError("VIN {} already registered.".format(data.get("vin")))

        #   Verifying raspberry pi is not duplicated
        querypi = Car.query.filter_by(raspbpi=data.get("raspbpi")).first()
        if querypi:
            return res.resourceExistsError("Raspberrypi {} already linked to car {}".format(data.get("raspbpi"), querypi.id))
        
        #   Adding Car to Database
        newCarDetails = {"vin":data.get("vin"), "carmodel": data.get("carmodel"), "raspbpi": data.get("raspbpi")}
        newCar, error = car_schema.load(newCarDetails)
        if error:
            return res.badRequestError(error)
        db.session.add(newCar)
        db.session.commit()
        return res.postSuccess("Successful car added to database.", newCar)

#   api/carregistration/customer/:accountId
class apiRegisterCustomerCar(Resource):

    #   Retrieves all the car registered under the given account
    def get(self, accountId):
        queryCarUser = CarUser.query.filter_by(account=accountId).all()
        if not queryCarUser:
            return res.resourceMissing("No cars registered under account {}.".format(accountId))
        usercars, error = carusers_schema.dump(queryCarUser)
        if error:
            return res.internalServiceError(error)
        customerCars = []
        for usercar in usercars:
            car = Car.query.filter_by(id=usercar["car"]).first()
            if not car:
                return res.resourceMissing("No data found for car {}.".format(usercar["car"]))
            usercar["carDetails"] = car_schema.dump(car).data
            queryCarModel = CarModel.query.filter_by(id=car.carmodel).first()
            if queryCarModel:
                usercar["carDetails"]["carmodelDetails"] = carmodel_schema.dump(queryCarModel).data
            customerCars.append(usercar)
        return res.getSuccess("Cars registered under account {}.".format(accountId), customerCars)
    
    #   Requires data in request body
    #   Example: {"vinNumber": "39834698347"}
    def post(self, accountId):
        data = request.get_json()

        #   Verifying data required for endpoint was given
        if not data or not data.get("vinNumber"):
            return res.badRequestError("Missing data to process request.")

        #   Verifying car given exists in database
        queryCar = Car.query.filter_by(vin=data.get("vinNumber")).first()
        if not queryCar:
            return res.resourceMissing("Car {} does not exist.".format(data.get("vinNumber")))
        
        #   Verifying car given is NOT registered under the given customer
        queryCarUser = CarUser.query.filter_by(car=queryCar.id, account=accountId).first()
        if queryCarUser:
            return res.resourceExistsError("Car already registered under customer {}.".format(accountId))

        #   Creata the link from user to the registered car in the database
        newCarUserDetails = { "car": queryCar.id, "account": accountId }
        newCarUser, error = caruser_schema.load(newCarUserDetails)
        if error:
            return res.internalServiceError(error)
        db.session.add(newCarUser)
        db.session.commit()
        return res.postSuccess("Car {} registered under customer {}.".format(data.get("vinNumber"), accountId))

#   /api/carregistration/caruser/:caruserId
class apiCustomerCar(Resource):
    def get(self, caruserId):
        queryCarUser = CarUser.query.filter_by(id=caruserId).first()

        #   Verifies car and customer registration exists
        if not queryCarUser:
            return res.resourceMissing("No data found for car registration.")

        queryCar = Car.query.filter_by(id=queryCarUser.car).first()

        #   Verifies car type data is available on database 
        #   (if fails this is an internal error, because data from model was deleted from database)
        if not queryCar:
            return res.resourceMissing("No data found for car type {}.".format(queryCarUser.car))
        
        caruser, error = caruser_schema.dump(queryCarUser)
        if error:
            return res.internalServiceError(error)
        caruser["cardetails"] = car_schema.dump(queryCar).data
        return res.getSuccess("Succesfully retrieved data for customer car registered.", caruser)
    
        
