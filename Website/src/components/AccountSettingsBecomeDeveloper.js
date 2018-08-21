import React from 'react';
import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';

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
		this.props.appState.becomeDeveloper();
		this.toggleBecomeDeveloperModal();
	}

	deleteDeveloper = () => {
		this.props.appState.deleteDeveloper();
		this.toggleBecomeDeveloperModal();
	}

	renderStuff(buttonText, innerButtonText, className, executeFunc) {
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
						<ButtonMakiti className={className} onClick={executeFunc}>
							{innerButtonText}
						</ButtonMakiti>
					</Modal>
				</div>
			</div>
		);
	}

	render() {
		if (this.props.appState.isDeveloper) {
			return (
				this.renderStuff(
					"Delete Developer Account?",
					"Permanently Delete Developer Account!",
					"text-bold-black bg-red",
					this.deleteDeveloper
				)
			);
		}

		return (
			this.renderStuff(
					"Become a Developer?",
					"Create Developer Account!",
					"text-bold-black bg-green",
					this.becomeDeveloper
				)
		);
	}
}

export default AccountSettingsBecomeDeveloper;