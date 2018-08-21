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

	render() {
		if (this.props.appState.isDeveloper) {
			return (
				<div className="center">
					<ButtonMakiti onClick={this.toggleBecomeDeveloperModal}>
						Delete Developer Account
					</ButtonMakiti>
					<Modal
						show={this.state.showDeveloperModal}
						onClose={this.toggleBecomeDeveloperModal}
						style={{width: 300}}
					>
						<ButtonMakiti className="text-bold-black bg-red" onClick={this.deleteDeveloper}>
							Permanently Delete Developer Account?
						</ButtonMakiti>
					</Modal>
				</div>
			);
		}

		return (
			<div className="center">
				<ButtonMakiti onClick={this.toggleBecomeDeveloperModal}>
					Become a Developer!
				</ButtonMakiti>
				<Modal
					show={this.state.showDeveloperModal}
					onClose={this.toggleBecomeDeveloperModal}
					style={{width: 300}}
				>
					<ButtonMakiti className="text-bold-black bg-green" onClick={this.becomeDeveloper}>
						Create a Developer Account?
					</ButtonMakiti>
				</Modal>
			</div>
		);
	}
}

export default AccountSettingsBecomeDeveloper;