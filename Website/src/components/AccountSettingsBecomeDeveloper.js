import React from 'react';
import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';
import axios from 'axios';

class AccountSettingsBecomeDeveloper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDeveloperModal: false,
		}
	}

	toggleBecomeDeveloperModal = () => {
		this.setState(() => ({ showDeveloperModal: !this.state.showDeveloperModal }));
	}

	becomeDeveloper = () => {
		let { id } = this.props.appState.accountDetails,
			{ updateAccountDetail } = this.props.appState;

		axios.put(`${ACCOUNT_SERVICE}/account/${id}`, {
				developer: 1,
			})
			.then(response => {
				const { data } = response.data;
				updateAccountDetail('developer', true);
			})
			.catch(err => {
				const { data } = err.response;
				console.log(err);
			})
		this.toggleBecomeDeveloperModal();
	}

	deleteDeveloper = () => {
		let { id } = this.props.appState.accountDetails,
			{ updateAccountDetail } = this.props.appState;

		axios.put(`${ACCOUNT_SERVICE}/account/${id}`, {
				developer: 0,
			})
			.then(response => {
				const { data } = response.data;
				updateAccountDetail('developer', false);
			})
			.catch(err => {
				const { data } = err.response;
				console.log(data);
			})
		this.toggleBecomeDeveloperModal();
	}

	renderStuff(buttonText, innerButtonText, btnColor, executeFunc) {
		return (
			<div>
				<div className="center">
					<ButtonMakiti onClick={this.toggleBecomeDeveloperModal}>
						{buttonText}
					</ButtonMakiti>
					<Modal
						show={this.state.showDeveloperModal}
						onClose={this.toggleBecomeDeveloperModal}
						style={{width: 300}}
					>
						<ButtonMakiti className={`text-bold-black ${btnColor}`} onClick={executeFunc}>
							{innerButtonText}
						</ButtonMakiti>
					</Modal>
				</div>
			</div>
		);
	}

	render() {
		const { developer: isDeveloper } = this.props.appState.accountDetails;
		if (isDeveloper) {
			return (
				this.renderStuff(
					"Delete Developer Account?",
					"Permanently Delete Developer Account!",
					"bg-red",
					this.deleteDeveloper
				)
			);
		}

		return (
			this.renderStuff(
					"Become a Developer?",
					"Create Developer Account!",
					"bg-green",
					this.becomeDeveloper
				)
		);
	}
}

export default AccountSettingsBecomeDeveloper;
