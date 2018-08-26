import axios from 'axios';
import React from 'react';

import AppList from './AppList';
import AppDetail from './AppDetail';
import LoginForm from './LoginForm';
import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';
import { RemoveAppButton } from './AppButtons';

import { application_service } from './AxiosHandler';

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

	accountModal = () => {
		
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
		this.toggleAccountModal();
	}

	delAppModal = () => {
		axios.get(`${APPLICATION_SERVICE}/application/`)
			.then(response => {
				const { data } = response.data;
				console.log(data);
				this.setState({ appList: data });
			})
			.catch(err => {
				// APPLICATION SERVICE UNREACHABLE
				this.setState({ appList: [], currentApp: null });
			});
		this.toggleDelAppModal();
	}

	aprAppModal = () => {	
		axios.get(`${APPLICATION_SERVICE}/application/`)
			.then(response => {
				const { data } = response.data;
				console.log(data);
				this.setState({ appList: data });
			})
			.catch(err => {
				// APPLICATION SERVICE UNREACHABLE
				this.setState({ appList: [], currentApp: null });
			});
		this.toggleAprAppModal();
	}

	render() {
		const { appList, currentApp, showDelAppModal, showAprAppModal, showAccountModal, removeApp, accountList } = this.state;
		const { appState } = this.props;
		const appButtonConfig = {
			remove: false, //
			install: true, //
			launch: false, //
		};

		// appList[0] = {
		// 	id: 134,
		// 	appname: 'poo',
		// 	description: 'cool',
		// 	version: '1.4',
		// 	active: 'true',
		// }
		// appList[1] = {
		// 	id: 144,
		// 	appname: 'KAKA',
		// 	description: 'cool',
		// 	version: '1.4',
		// 	active: false
		// }
		// appList[2] = {
		// 	id: 145,
		// 	appname: 'Asslover',
		// 	description: 'cool',
		// 	version: '1.4',
		// 	datecreated: 'Monday',
		// 	active: false
		// }

		// accountList[0] = {
		// 	username: "Buttfucker69",
		// 	firstname: "Dago",
		// 	lastname: "Gaylord",
		// 	customer: "false",
		// 	developer: "true",
		// 	admin: "false"
		// }

		// accountList[1] = {
		// 	username: "Nick",
		// 	firstname: "Nick",
		// 	lastname: "Wang",
		// 	customer: "true",
		// 	developer: "true",
		// 	admin: "false"
		// }

		// accountList[2] = {
		// 	username: "dorfnox",
		// 	firstname: "Brendan",
		// 	lastname: "Pierce",
		// 	customer: "true",
		// 	developer: "true",
		// 	admin: "false"
		// }

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
								{appList.map((app) => {if (app.active == false)
									return(
										<div className="admin-app-list" key={app.id}> 
										<div className="admin-app-list-item h5">App Name: {app.appname}<br/>
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
									);
									else
										return(null);
								}
								)}
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
								{appList.map((app) => (
									<div className="admin-app-list" key={app.id}> 
										<div className="admin-app-list-item h5">App Name: {app.appname}<br/>
										Date Created: {Date(Date.parse(app.datecreated)).toLocaleString()}<br/>
										Version: {app.version}<br/>
										Active Status: {app.active}
										</div>
										<ButtonMakiti className="admin-app-delete-button" onClick={this.deleteAccount}>
											Remove Application
										</ButtonMakiti>
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
								{accountList.map((login) => (
									<div className="admin-app-list" key={login.id}> 
										<div className="admin-app-list-item h5">Login: {login.username}<br/>
										Full Name: {login.firstname} {login.lastname}<br/>
										Customer Status: {login.customer}<br/>
										Developer Status: {login.developer}<br/>
										Admin Status: {login.admin}
										</div>
										<ButtonMakiti className="admin-app-delete-button" onClick={this.deleteAccount}>
											Delete Account
										</ButtonMakiti>
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
