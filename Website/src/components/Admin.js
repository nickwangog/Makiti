import axios from 'axios';
import React from 'react';

import AppList from './AppList';
import AppDetail from './AppDetail';
import LoginForm from './LoginForm';
import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';
import { RemoveAppButton, DeleteAccountButton } from './AppButtons';

import { application_service, account_service } from './AxiosHandler';

class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appList: [],
			currentApp: null,
			showDelAppModal: false,
			showAccountModal: false,
			accountList: [],
			errorText: '',
			successText: '',
			showAprAppModal: false,
		};
	}


	setErrorText = (text) => {
		this.setState({ errorText: text, successText: '' });
	}

	setSuccessText = (text) => {
		this.setState({ successText: text, errorText: '' });
	}

	toggleDelAppModal = () => {
		this.setState(() => ({ showDelAppModal: !this.state.showDelAppModal }));
	}

	toggleAccountModal = () => {
		this.setState(() => ({ showAccountModal: !this.state.showAccountModal }));
	}
	
	toggleAprAppModal = () => {
		this.setState(() => ({ showAprAppModal: !this.state.showAprAppModal }));
	}

	refreshApps = () => {
		application_service.get(`/application/`)
			.then(data => {
				this.setState({ appList: data.data });
			})
			.catch(err => {
				this.setState({ appList: [], currentApp: null });
			});
	}

	refreshAccounts = () => {
		account_service.get(`/account/`)
			.then(data => {
				this.setState({ accountList: data.data });
			})
			.catch(err => {
				// APPLICATION SERVICE UNREACHABLE
				let error = err.data;
				error = error ? error.message : err;
				this.setState({ accountList: [], currentApp: null, errorText: error, successText: '' });
			});
	}

	aprAppModal = () => {	
		this.refreshApps();
		this.toggleAprAppModal();
	}

	delAppModal = () => {
		this.refreshApps();
		this.toggleDelAppModal();
	}

	accountModal = () => {
		this.refreshAccounts();
		this.toggleAccountModal();
	}

	render() {
		const { appList, currentApp, showDelAppModal, showAprAppModal, showAccountModal, removeApp, accountList } = this.state;
		const { appState } = this.props;
		const parentFuncs = {
			setSuccessText: this.setSuccessText,
			setErrorText: this.setErrorText,
		}

		return (
			<div>
				<main className="flex flex-column">
					<h1 className="page-header">Admin Home</h1>
					<div className="center">
						<ButtonMakiti onClick={this.aprAppModal}>
							Approve Applications
						</ButtonMakiti>
						<Modal
							show={showAprAppModal}
							onClose={this.toggleAprAppModal}
							style={{width: 300}}
						>
							<div>
								{appList.map((app) => (app.active == false ?
										<div className="admin-app-list" key={app.id}> 
											<div className="admin-app-list-item h5">
												App Name: {app.appname}<br/>
												Date Created: {Date(Date.parse(app.datecreated)).toLocaleString()}<br/>
												Version: {app.version}<br/>
												<p className="orange">Pending Approval</p>
											</div>
											<div>
												<ButtonMakiti className="admin-viewlog-button" onClick={this.deleteAccount}>
													View Validation Log
												</ButtonMakiti>
												<ButtonMakiti className="admin-app-approve-button" onClick={this.deleteAccount}>
													Approve Application
												</ButtonMakiti>
												<ButtonMakiti className="admin-app-reject-button" onClick={this.deleteAccount}>
													Reject Application
												</ButtonMakiti>
											</div>
										</div>
										:
										null
								))}
							</div>
						</Modal>
					</div>
					<div className="center">
						<ButtonMakiti onClick={this.delAppModal}>
							Manage Applications
						</ButtonMakiti>
						<Modal
							show={showDelAppModal}
							onClose={this.toggleDelAppModal}
							style={{width: 300}}
						>
							<div>
								{
									appList.map((app) => (
									<div className="admin-app-list" key={app.id}> 
										<div className="admin-app-list-item h5">App Name: {app.appname}<br/>
										Date Created: {Date(Date.parse(app.datecreated)).toLocaleString()}<br/>
										Version: {app.version}<br/>
										Active Status: {app.active}
										</div>
										<RemoveAppButton
											className="admin-app-delete-button"
											app={app}
											show={true}
											parentFuncs={parentFuncs}
											onSuccess={this.refreshApps}
											onFail={() => {this.setErrorText("Failed to Remove App")}}
										/>
									</div>
								))}
							</div>
						</Modal>
					</div>
					<div className="center">
						<ButtonMakiti onClick={this.accountModal}>
							Manage Accounts
						</ButtonMakiti>
						<Modal
							show={showAccountModal}
							onClose={this.toggleAccountModal}
							style={{width: 300}}
						>
							<div>
								{
									accountList.map((login) => (
									<div className="admin-app-list" key={login.id}> 
										<div className="admin-app-list-item h5">Login: {login.username}<br/>
										Full Name: {login.firstname} {login.lastname}<br/>
										Customer Status: {login.customer ? 'True' : 'False'}<br/>
										Developer Status: {login.developer ? 'True' : 'False'}<br/>
										Admin Status: {login.admin ? 'True' : 'False'}
										</div>
										<DeleteAccountButton
											className="admin-app-delete-button"
											show={true}
											parentFuncs={parentFuncs}
											accountId={login.id}
											onSuccess={this.refreshAccounts}
											onFail={() => {this.setErrorText("Failed to Remove Account")}}
										/>
									</div>
								))}
							</div>
						</Modal>
					</div>
				</main>
			</div>
		);
	}
}
		

export default Admin;
