class dbTest ():
    module = "postgresql+psycopg2://"
    username = "dmontoya:"
    password = "Makiti@2019"
    address = "@192.168.99.100"
    port = ":5432"
    dbname = "/carregistrationservice"
    environment = "test"

class dbProduction ():
    module = ""
    username = ""
    password = ""
    address = ""
    port = ""
    dbname = ""
    environment = "production"

class dbDevelopment():
    module = ""
    username = ""
    password = ""
    address = ""
    port = ""
    dbname = ""
    environment = "development"

def dbConnection(environment):
    if environment == "development":
        return (dbDevelopment.module + dbDevelopment.username + dbDevelopment.password + dbDevelopment.address + dbDevelopment.port + dbDevelopment.dbname)
    elif environment == "production":
        return (dbProduction.module + dbProduction.username + dbProduction.password + dbProduction.address + dbProduction.port + dbProduction.dbname)
    else:
        return (dbTest.module + dbTest.username + dbTest.password + dbTest.address + dbTest.port + dbTest.dbname)
