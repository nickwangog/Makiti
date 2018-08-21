import React from 'react';
import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';

class AccountSettingsDelete extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDeleteModal: false,
		}
	}

	toggleDeleteAccountModal = () => {
		this.setState(() => ({ showDeleteModal: !this.state.showDeleteModal }));
	}

	deleteAccount = () => {
		// do a request to delete account

		// perform logout
		this.props.appState.logout();
		// change redirect state of parent class to redirect to home page
		this.props.onDelete();
	}

	render() {
		return (
			<div className="center">
				<ButtonMakiti onClick={this.toggleDeleteAccountModal}>
					Delete Account!
				</ButtonMakiti>
				<Modal
					show={this.state.showDeleteModal}
					onClose={this.toggleDeleteAccountModal}
					style={{width: 300}}
				>
					<ButtonMakiti className="text-bold-black bg-red" onClick={this.deleteAccount}>
						Permanently Delete Account?
					</ButtonMakiti>
				</Modal>
			</div>
		);
	}
}

export default AccountSettingsDelete;