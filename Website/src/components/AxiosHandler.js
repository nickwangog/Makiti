import axios from 'axios'

const AxiosHandler = function() {

	this._onSuccess = function(response) {
		console.log('Request Successful!', response);
		return response.data;
	}

	this._onError = function(error) {
		console.error('Request Failed...', error.config);

		if (error.response) {
			// Request was made, but server responded with !2XX
			console.error('Status:',	error.response.status);
			console.error('Data:',	error.response.data);
			console.error('Headers:', error.response.headers);
		} else {
			// Something else happened while setting up the request
			console.error('Server Error:', error.message);
		}
		return Promise.reject(error.response || error.message);
	}

	this._get = function(endpoint, data, headers) {
		return axios.get(endpoint, data, headers)
			.then(this._onSuccess)
			.catch(this._onError);
	}

	this._post = function(endpoint, data, headers) {
		return axios.post(endpoint, data, headers)
			.then(this._onSuccess)
			.catch(this._onError);
	}

	this._put = function(endpoint, data, headers) {
		return axios.put(endpoint, data, headers)
			.then(this._onSuccess)
			.catch(this._onError);
	}

	this._delete = function(endpoint, data, headers) {
		return axios.put(endpoint, data, headers)
			.then(this._onSuccess)
			.catch(this._onError);
	}
}


const AccountService = function() {
	this.endpoint = `${ACCOUNT_SERVICE}`;
	this.ax = new AxiosHandler();

	this.get = function(e, d, h) {
		return this.ax._get(`${this.endpoint}${e}`, d, h);
	}

	this.post = function(e, d, h) {
		return this.ax._post(`${this.endpoint}${e}`, d, h);
	}

	this.put = function(e, d, h) {
		return this.ax._put(`${this.endpoint}${e}`, d, h);
	}

	this.delete = function(e, d, h) {
		return this.ax._delete(`${this.endpoint}${e}`, d, h);
	}
}

const ApplicationService = function() {
	this.endpoint = `${APPLICATION_SERVICE}`;
	this.ax = new AxiosHandler();

	this.get = function(e, d, h) {
		return this.ax._get(`${this.endpoint}${e}`, d, h);
	}

	this.post = function(e, d, h) {
		return this.ax._post(`${this.endpoint}${e}`, d, h);
	}

	this.put = function(e, d, h) {
		return this.ax._put(`${this.endpoint}${e}`, d, h);
	}

	this.delete = function(e, d, h) {
		return this.ax._delete(`${this.endpoint}${e}`, d, h);
	}
}

const AppRequestService = function() {
	this.endpoint = `${APP_REQUEST_SERVICE}`;
	this.ax = new AxiosHandler();

	this.get = function(e, d, h) {
		return this.ax._get(`${this.endpoint}${e}`, d, h);
	}

	this.post = function(e, d, h) {
		return this.ax._post(`${this.endpoint}${e}`, d, h);
	}

	this.put = function(e, d, h) {
		return this.ax._put(`${this.endpoint}${e}`, d, h);
	}

	this.delete = function(e, d, h) {
		return this.ax._delete(`${this.endpoint}${e}`, d, h);
	}
}

const CarRegistrationService = function() {
	this.endpoint = `${CAR_REGISTRATION_SERVICE}`;
	this.ax = new AxiosHandler();

	this.get = function(e, d, h) {
		return this.ax._get(`${this.endpoint}${e}`, d, h);
	}

	this.post = function(e, d, h) {
		return this.ax._post(`${this.endpoint}${e}`, d, h);
	}

	this.put = function(e, d, h) {
		return this.ax._put(`${this.endpoint}${e}`, d, h);
	}

	this.delete = function(e, d, h) {
		return this.ax._delete(`${this.endpoint}${e}`, d, h);
	}
}


const account_service = new AccountService();
const application_service = new ApplicationService();
const app_request_service = new AppRequestService();
const car_registration_service = new CarRegistrationService();

export {
	account_service,
	application_service,
	app_request_service,
	car_registration_service,
}