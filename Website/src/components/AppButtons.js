import React from 'react';
import classNames from 'classnames';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';

const RemoveAppButton = ({ ...props }) => {
	const { show, app } = { ...props };

	if (!show) {
		return null;
	}

	const removeApp = (id) => {
		axios.delete(`${APPLICATION_SERVICE}/application/${id}`, {

		})
		.then(response => {
			const { data } = response.data;
			console.log(data);
		})
		.catch(err => {
			if (!err.response) {
				console.log("no response from server");
				return ;
			}
		});
	}

	return (
		<div>
			<ButtonMakiti className="text-bold-black bg-red" onClick={() => (removeApp(app.id))}>
				Remove
			</ButtonMakiti>
		</div>
	);
}

const InstallAppButton = ({ ...props }) => {
	const { app, show } = { ...props };

	if (!show) {
		return null;
	}

	const installApp = (customerId) => {
		axios.post(`${APP_REQUEST_SERVICE}/apprequest/customer/${customerId}`, {

		})
		.then(response => {
			const { data } = response.data;
			console.log(data);
		})
		.catch(err => {
			if (!err.response) {
				console.log("no response from server");
				return ;
			}
		});
	}

	return (
		<div>
			<ButtonMakiti className="text-bold-black bg-green" onClick={() => (installApp())}>
				Install
			</ButtonMakiti>
		</div>
	);
}


export {
	RemoveAppButton,
	InstallAppButton,
}
