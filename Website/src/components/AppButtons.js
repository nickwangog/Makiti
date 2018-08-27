import React from 'react';
import classNames from 'classnames';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import LaunchAppModal from './LaunchAppModal';
import InstallAppModal from './InstallAppModal';
import RegisterCarModalButton from './RegisterCarModalButton';
import ViewLogModal from './ViewLogModal';

import { app_request_service, application_service, account_service } from './AxiosHandler';


const RemoveAppButton = ({ ...props }) => {
	const { show, app, className, parentFuncs, onSuccess, onFail } = { ...props };

	if (!show) {
		return null;
	}

	const removeApp = (appId) => {
		application_service.delete(`/application/${appId}`)
		.then(response => {
			parentFuncs.setSuccessText(`Successfully removed app ${app.appname}`);
			if (onSuccess) {
				onSuccess();
			}
		})
		.catch(err => {
			parentFuncs.setErrorText(`Was unable to remove app ${app.appname}`);
			if (onFail) {
				onFail();
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

class AddAppIconButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			icon: null,
		}
	}

	toggleModal = () => {
		this.setState({ showModal: true });
	}

	addIcon = () => {
		const { app, parentFuncs } = this.props;

		application_service.post(`/application/${app.id}`)
		.then(response => {
			parentFuncs.setSuccessText(`Successfully added Icon to ${app.appname}`);
		})
		.catch(err => {
			parentFuncs.setErrorText(`Failed to add Icon for ${app.appname}`);
		});
	}

	render() {

		const { show, app, className, parentFuncs } = this.props;
		const { showModal } = this.state;

		if (!show) {
			return null;
		}

		return (
			<div>
				<ButtonMakiti
					className={classNames("text-bold-black bg-red", className)}
					onClick={this.toggleModal}
				>
					Add Icon
				</ButtonMakiti>
				<Modal
					show={showModal}
					onClose={this.toggleModal}
					style={{width: 300}}
				>
					<div>
						<ButtonMakiti
							className={classNames("text-bold-black bg-red", className)}
							onClick={this.addIcon}
						>
							Add Icon
						</ButtonMakiti>
					</div>
				</Modal>
			</div>
		);
	}
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
		const { show, app, className, logFile, parentFuncs } = this.props;
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
				<LaunchAppModal show={showModal} toggle={this.toggleModal} app={app} logFile={logFile} parentFuncs={parentFuncs}/>
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
		const { show, app, className, appState, parentFuncs } = this.props;
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
				<InstallAppModal show={showModal} toggle={this.toggleModal} app={app} appState={appState} parentFuncs={parentFuncs}/>
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
		// app_request_service.post(`/apprequest/customer/${customerId}`)
		// .then(data => {
		// 	data = data.data;
		// })
		// .catch(err => {
		// 	return ;
		// });
		// THIS UNINSTALLS THE APP
	}

	return (
		<div>
			<ButtonMakiti
				className={classNames("text-bold-black bg-red", className)}
				onClick={() => (uninstallApp(""))}
			>
				Uninstall
			</ButtonMakiti>
		</div>
	);
}

const DeleteAccountButton = ({ ...props }) => {
	
	const { show, className, parentFuncs, onSuccess, onFail, accountId } = { ...props };

	const deleteAccount = () => {
		account_service.delete(`/account/${accountId}`)
			.then(data => {
				parentFuncs.setSuccessText('Successfully removed Account');
				if (onSuccess) {
					onSuccess();
				}
			})
			.catch(err => {
				parentFuncs.setErrorText('Unable to Delete Account');
				if (onFail) {
					onFail();
				}
			});
	}

	if (!show) {
		return null;
	}

	return (
		<div>
			<ButtonMakiti
				className={classNames("text-bold-black bg-red", className)}
				onClick={deleteAccount}
			>
				Delete Account
			</ButtonMakiti>
		</div>
	);
}


class ViewLogButton extends React.Component {
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
		const { show, app, className, logFile, parentFuncs } = this.props;
		const { showModal } = this.state;

		if (!show) {
			return null;
		}

		return (
			<div>
				<ButtonMakiti 
					className={classNames("text-bold-black bg-yellow", className)}
					onClick={this.toggleModal}
				>
					Corrective Actions Log
				</ButtonMakiti>
				<ViewLogModal show={showModal} toggle={this.toggleModal} app={app} logFile={logFile} parentFuncs={parentFuncs}/>
			</div>
		);
	}
}

export {
	RemoveAppButton,
	InstallAppButton,
	UninstallAppButton,
	LaunchAppVersionButton,
	DeleteAccountButton,
	ViewLogButton,
}
