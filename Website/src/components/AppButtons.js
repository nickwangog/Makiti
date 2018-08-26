import React from 'react';
import classNames from 'classnames';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import LaunchAppModal from './LaunchAppModal';
import InstallAppModal from './InstallAppModal';

import { app_request_service, application_service } from './AxiosHandler';


const RemoveAppButton = ({ ...props }) => {
	const { show, app, className, parentFuncs } = { ...props };

	if (!show) {
		return null;
	}

	const removeApp = (appId) => {
		axios.delete(`${APPLICATION_SERVICE}/application/${appId}`)
		.then(response => {
			parentFuncs.setDevSuccessText(`Successfully removed app ${app.appname}`)
		})
		.catch(err => {
				return ;
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

class LaunchAppVersionButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
		}
	}

	toggleModal = () => {
		this.setState({ showModal: !this.state.showModal });
	}

	render() {
		const { show, app, className, logFile } = this.props;
		const { showModal } = this.state;

		if (!show) {
			return null;
		}

		return (
			<div>
				<ButtonMakiti 
					className={classNames("text-bold-black bg-green", className)}
					onClick={this.toggleModal}
				>
					Launch App!
				</ButtonMakiti>
				<LaunchAppModal show={showModal} toggle={this.toggleModal} app={app} logFile={logFile} />
			</div>
		);
	}
}

class InstallAppButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
		}
	}

	toggleModal = () => {
		this.setState({ showModal: !this.state.showModal });
	}

	render() {
		const { show, app, className, appState } = this.props;
		const { showModal } = this.state;

		if (!show) {
			return null;
		}

		return (
			<div>
				<ButtonMakiti
					className={classNames("text-bold-black bg-green", className)}
					onClick={this.toggleModal}
				>
					Install
				</ButtonMakiti>
				<InstallAppModal show={showModal} toggle={this.toggleModal} app={app} appState={appState} />
			</div>
		);
	}
}

const UninstallAppButton = ({ ...props }) => {
	const { show, app, className } = { ...props };

	if (!show) {
		return null;
	}

	const uninstallApp = (customerId) => {
		app_request_service.post(`/apprequest/customer/${customerId}`)
		.then(data => {
			data = data.data;
		})
		.catch(err => {
			return ;
		});
	}

	return (
		<div>
			<ButtonMakiti
				className={classNames("text-bold-black bg-red", className)}
				onClick={() => (uninstallApp("akldsfjaklsdfjaksdlfjkladsjflkadsjflkadsjfklajklfdjdlkjs"))}
			>
				unInstall
			</ButtonMakiti>
		</div>
	);
}

export {
	RemoveAppButton,
	InstallAppButton,
	UninstallAppButton,
	LaunchAppVersionButton,
}
