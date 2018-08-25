import React from 'react';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';

class AccountSettingsDelete extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDeleteModal: false,
			errorText: '',
		}
	}

	toggleDeleteAccountModal = () => {
		this.setState(() => ({ showDeleteModal: !this.state.showDeleteModal }));
	}

	deleteAccount = () => {
		// do a request to delete account
		let { id } = this.props.appState.accountDetails;
		let { clearAccountDetails } = this.props.appState;

		axios.delete(`${ACCOUNT_SERVICE}/account/${id}`)
			.then(response => {
				const { data } = response.data;
				console.log("Account deleted: ", data);
				// perform logout - should redirect to top level
				clearAccountDetails();
			})
			.catch(err => {
				console.log("FAILURE");
				const { data } = err.response;
				this.setState(() => ({ errorText: data.message }));
			});
	}

	render() {
		const { errorText, showDeleteModal } = this.state;

		return (
			<div className="center">
				<ButtonMakiti onClick={this.toggleDeleteAccountModal}>
					Delete Account!
				</ButtonMakiti>
				<Modal
					show={showDeleteModal}
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
