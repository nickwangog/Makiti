import React from 'react';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';

import { account_service } from './AxiosHandler';

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

		account_service.delete(`${ACCOUNT_SERVICE}/account/${id}`)
			.then(data => {
				// perform logout - should redirect to top level
				clearAccountDetails();
			})
			.catch(err => {
				const { data } = err;
				this.setState(() => ({ errorText: data || err }));
			});
	}

	render() {
		const { errorText, showDeleteModal } = this.state;

		return (
			<div className="center">
				<ButtonMakiti onClick={this.toggleDeleteAccountModal}>
					Delete Account
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
