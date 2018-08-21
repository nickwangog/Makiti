if __name__ == '__main__':
	from api.app import app
	app.run(host='0.0.0.0', port=9922)