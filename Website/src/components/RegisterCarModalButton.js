import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
import qs from 'qs';
import { sha256 } from 'js-sha256';

import ButtonMakiti from './ButtonMakiti';
import InputMakiti from './InputMakiti';
import Modal from './Modal';
import RegisteredVehiclesList from './RegisteredVehiclesList';

import { car_registration_service } from './AxiosHandler';

class RegisterCarModalButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			errorText: '',

			vinNumber: '',
			vinNumberErr: '',
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value,
						[`${e.target.name}Err`]: ''});
	}

	toggleModal = () => {
		this.setState(() => ({ showModal: !this.state.showModal }));
	}

	setErrorText = (text) => {
		this.setState(() => ({ errorText: text }));
	}

	submitRegistration = (e) => {
		e.preventDefault();

		// Validate Form and submit application
		this.validateFormData(() => {
			const { vinNumber } = this.state;
			let { id } = this.props.appState.accountDetails;

			// Request for a new App
			car_registration_service.post(`/carregistration/customer/${id}`, {
					'vinNumber': vinNumber,
				})
				.then(response => {
					this.toggleModal();
					this.props.parentFuncs.setSuccessText("You have successfully registered your vehicle!");
					this.props.parentFuncs.setErrorText("");
				})
				.catch(err => {
					let error = err.data;
					error = error ? error.message : err;
					this.setErrorText(error);
					this.props.parentFuncs.setErrorText(error);
				});
		});
	}

	validateFormData = (onSuccess) => {
		const { vinNumber } = this.state;

		// Successful validation
		if (vinNumber.length) {
			this.setState(() => ({
				errorText: '',
				vinNumberErr: '',
			}), onSuccess());
			return ;
		}

		// Validation Failure
		this.setState(() => ({
			vinNumberErr: !vinNumber.length ? "required" : '',
			errorText: '',
		}));
	}

	render() {
		const {	showModal,
				errorText,
				vinNumber, vinNumberErr } = this.state;

		return (
			<div className="center">
				<ButtonMakiti onClick={this.toggleModal}>
					Register Vehicle ➕
				</ButtonMakiti>
				<Modal
					show={showModal}
					onClose={this.toggleModal}
					style={{ width: 300 }}
				>
					<div>
						<p className="text-error-red">{errorText}</p>
						<RegisteredVehiclesList { ...this.props }/>
						<InputMakiti
							autoFocus
							show={true}
							name="vinNumber"
							fieldname="Vin Number"
							errors={vinNumberErr}
							value={vinNumber}
							onChange={this.onChange}
						/>
						<ButtonMakiti className="text-bold-black bg-green" onClick={this.submitRegistration}>
							Submit Car Registration!
						</ButtonMakiti>
					</div>
				</Modal>
			</div>
		);
	}
}

export default RegisterCarModalButton;
