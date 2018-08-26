import React from 'react';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';
import RegisteredVehiclesList from './RegisteredVehiclesList';
import RegisterCarModalButton from './RegisterCarModalButton';

class InstallAppModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errorText: '',
			selectedVehicle: null,
		}
	}

	setErrorText = (text) => {
		this.setState({errorText: text});
	}

	installApp = (customerId) => {
		const { selectedVehicle } = this.state;

		if (!selectedVehicle) {
			return this.setErrorText("Please select a vehicle");
		}
 
 		const appDetails = { ...this.props.app };
		axios.post(`${APP_REQUEST_SERVICE}/apprequest/customer/${customerId}`, {
			...selectedVehicle,
			appDetails: appDetails,
			...this.props.appState,
		})
		.then(data => {
			data = data.data;
			this.props.parentFuncs.setSuccessText("Successfully Installed App!");

		})
		.catch(err => {
			this.props.parentFuncs.setErrorText("Error occurred installing App");
		});
	}

	setSelectedVehicle = (v) => {
		this.setState({
			selectedVehicle: v,
		})
	}

	render() {
		const { errorText } = this.state;
		const { show, toggle, app, ...rest } = this.props;
		
		// delete later
		if (!app.appversionDetails) {
			return null;
		}

		const { id } = this.props.appState.accountDetails;

		return (
			<div className="center">
				<Modal
					show={show}
					onClose={toggle}
					style={{width: 300}}
				>
					<div>
						<span className="text-error-red">{errorText}</span>
						<h5 className="h5">Choose a vehicle to install App into</h5>
						<RegisteredVehiclesList { ...this.props } onClick={this.setSelectedVehicle} />
						<ButtonMakiti
							className="text-bold-black bg-green"
							onClick={() => this.installApp(id)}
						>
							Install App!
						</ButtonMakiti>
						<RegisterCarModalButton { ...this.props } />
					</div>
				</Modal>
			</div>
		);
	}
}

export default InstallAppModal;
