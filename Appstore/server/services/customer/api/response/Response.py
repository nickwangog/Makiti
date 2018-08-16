#	HTTP formatted responses :D


#	General success/error helper functions
#	-------------------------------------------------------------------

def formatReturn(status, message, data, statusCode):
	return {'status': status, 'message': message, 'data': data}, statusCode

def formatMessage(defaultMessage, message):
	if message is not '':
		defaultMessage = '{} - {}'.format(defaultMessage, message)
	return defaultMessage

def formatError(defaultMessage, message, statusCode):
	message = formatMessage(defaultMessage, message)
	return formatReturn('error', message, {}, statusCode)

def formatSuccess(defaultMessage, message, data, statusCode):
	message = formatMessage(defaultMessage, message)
	statusCode = statusCode if data is not {} and data is not [] else 204
	return formatReturn('success', message, data, statusCode)



#	Primary ERROR-return functions
#	-------------------------------------------------------------------

#	main server-error
def internalServiceError(message=''):
	return formatError('Internal API service error', message, 500)

#	main user-error
def badRequestError(message=''):
	return formatError('Bad request for API service', message, 400)

#	attempted to create a duplicate resource
def resourceExistsError(message=''):
	return formatError('Resource already exists', message, 418)

#	empty resource
def resourceMissing(message=''):
	return formatError('Resource does not exist', message, 400)



#	Primary SUCCESS-return functions
#	-------------------------------------------------------------------

def getSuccess(message='', data={}):
	return formatSuccess('GET request was successful', message, data, 200)

def postSuccess(message='', data={}):
	return formatSuccess('POST request was successful', message, data, 201)

def putSuccess(message='', data={}):
	return formatSuccess('PUT request was successful', message, data, 200)

def deleteSuccess(message='', data={}):
	return formatSuccess('DELETE request was successful', message, data, 204)