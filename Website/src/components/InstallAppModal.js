import React from 'react';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';
import RegisteredVehiclesList from './RegisteredVehiclesList';

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
 
 		console.log(this.props);
 		const appDetails = { ...this.props.app };
		axios.post(`${APP_REQUEST_SERVICE}/apprequest/customer/${customerId}`, {
			...selectedVehicle,
			appDetails: appDetails,
			...this.props.appState,
		})
		.then(response => {
			console.log("SUCCESS", response);
			const { data } = response.data;
		})
		.catch(err => {
			console.log("ERROR", err);
			if (!err.response) {
				console.log("no response from server");
				return ;
			}
		});
	}

	setSelectedVehicle = (v) => {
		this.setState({
			selectedVehicle: v,
		})
		console.log("SELECTED VEHICLE", this.state.selectedVehicle);
	}

	render() {
		console.log("INSTALLAPPMODAL", this.props);
		const { errorText } = this.state;
		const { show, toggle, app, ...rest } = this.props;
		if (!app.appversionDetails) {
			console.log("wont open");
			return null;
		}

		console.log(this.props);
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
						<RegisteredVehiclesList { ...this.props } onClick={this.setSelectedVehicle}/>
						<ButtonMakiti
							className="text-bold-black bg-green"
							onClick={() => this.installApp(id)}
						>
							Install App!
						</ButtonMakiti>
					</div>
				</Modal>
			</div>
		);
	}
}

export default InstallAppModal;
