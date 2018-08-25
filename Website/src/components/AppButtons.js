import React from 'react';
import classNames from 'classnames';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import LaunchAppModal from './LaunchAppModal';

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

class LaunchAppVersionButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		}
	}

	toggleModal = () => {
		this.setState({ showModal: !this.state.showModal });
	}

	render() {
		const { show, app, className } = this.props;
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
				<LaunchAppModal show={showModal} toggle={this.toggleModal} app={app} />
			</div>
		);
	}
}

const InstallAppButton = ({ ...props }) => {
	const { show, app, className } = { ...props };

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