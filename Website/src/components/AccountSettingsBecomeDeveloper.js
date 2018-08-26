import React from 'react';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';

import { account_service } from './AxiosHandler';

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

		account_service.put(`/account/${id}`, {
				developer: 1,
			})
			.then(data => {
				updateAccountDetail('developer', true);
			})
			.catch(err => {
				return ;
			})
		this.toggleBecomeDeveloperModal();
	}

	deleteDeveloper = () => {
		let { id } = this.props.appState.accountDetails,
			{ updateAccountDetail } = this.props.appState;

		account_service.put(`/account/${id}`, {
				developer: 0,
			})
			.then(data => {
				updateAccountDetail('developer', false);
			})
			.catch(err => {
				return ;
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
					"Delete Developer Account",
					"Permanently Delete Developer Account?",
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
