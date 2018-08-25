import React from 'react';
import classNames from 'classnames';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';

const RemoveAppButton = ({ ...props }) => {
	const { show, app, className } = { ...props };

	if (!show) {
		return null;
	}

	const removeApp = (appId) => {
		axios.delete(`${APPLICATION_SERVICE}/application/${appId}`)
		.then(response => {
			const { data } = response.data;
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
			<ButtonMakiti
				className={classNames("text-bold-black bg-red", className)}
				onClick={() => (removeApp(app.id))}
			>
				Remove
			</ButtonMakiti>
		</div>
	);
}

const LaunchAppVersionButton = ({ ...props }) => {
	const { show, app } = { ...props };

	if (!show) {
		return null;
	}

	const launchApp = (appVersionId) => {
		axios.post(`${APPLICATION_SERVICE}/application/${appVersionId}/launch`)
		.then(response => {
			const { data } = response.data;
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
			<ButtonMakiti 
				className={classNames("text-bold-black bg-green", className)}
				onClick={() => (launchApp("DFdafkljdsflkdasjflkadjsfkljadsfkljadsfkljasdklfjasdlkfj"))}
			>
				Launch App!
			</ButtonMakiti>
		</div>
	);
}

const InstallAppButton = ({ ...props }) => {
	const { show, app } = { ...props };

	if (!show) {
		return null;
	}

	const installApp = (customerId) => {
		axios.post(`${APP_REQUEST_SERVICE}/apprequest/customer/${customerId}`)
		.then(response => {
			const { data } = response.data;
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
			<ButtonMakiti
			className={classNames("text-bold-black bg-green", className)}
			onClick={() => (installApp("akldsfjaklsdfjaksdlfjkladsjflkadsjflkadsjfklajklfdjdlkjs"))}
			>
				Install
			</ButtonMakiti>
		</div>
	);
}


export {
	RemoveAppButton,
	InstallAppButton,
	LaunchAppVersionButton,
}
