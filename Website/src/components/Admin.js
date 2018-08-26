import axios from 'axios';
import React from 'react';

import AppList from './AppList';
import AppDetail from './AppDetail';
import LoginForm from './LoginForm';
import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';
import { RemoveAppButton } from './AppButtons';

class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appList: [],
			currentApp: null,
			showAppModal: false,
			showAccountModal: false,
			accountList: []
		};
	}

	toggleAppModal = () => {
		this.setState(() => ({ showAppModal: !this.state.showAppModal }));
	}

	appModal = () => {
		
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
	this.toggleAppModal();
	}

	toggleAccountModal = () => {
		this.setState(() => ({ showAccountModal: !this.state.showAccountModal }));
	}

	accountModal = () => {
		
		axios.get(`${ACCOUNT_SERVICE}/account/`)
			.then(response => {
				const { data } = response.data;
				console.log(data);
				this.setState({ accountList: data });
			})
			.catch(err => {
				// APPLICATION SERVICE UNREACHABLE
				this.setState({ accountList: [], currentApp: null });
			});
		this.toggleAccountModal();
	}

	render() {
		const { appList, currentApp, showAppModal, showAccountModal, removeApp, accountList } = this.state;
		const { appState } = this.props;
		const appButtonConfig = {
			remove: false, //
			install: true, //
			launch: false, //
		};

		appList[0] = {
			id: 134,
			appname: 'poo',
			description: 'cool',
			version: '1.4',
			active: 'No',
		}
		appList[1] = {
			id: 144,
			appname: 'KAKA',
			description: 'cool',
			version: '1.4',
			active: 'Yes',
		}
		appList[2] = {
			id: 145,
			appname: 'Asslover',
			description: 'cool',
			version: '1.4',
			datecreated: 'Monday',
			active: 'Yes',
		}

		accountList[0] = {
			username: "Buttfucker69",
			firstname: "Dago",
			lastname: "Gaylord",
			customer: "false",
			developer: "true",
			admin: "false"
		}

		accountList[1] = {
			username: "Nick",
			firstname: "Nick",
			lastname: "Wang",
			customer: "true",
			developer: "true",
			admin: "false"
		}

		accountList[2] = {
			username: "dorfnox",
			firstname: "Brendan",
			lastname: "Pierce",
			customer: "true",
			developer: "true",
			admin: "false"
		}

		return (
			<div>
				<main className="flex flex-column">
					<h1 className="page-header">Admin Home</h1>
					<div className="center">
						<ButtonMakiti onClick={this.appModal}>
							Manage Applications
						</ButtonMakiti>
						<Modal
							show={showAppModal}
							onClose={this.toggleAppModal}
							style={{width: 300}}
						>
							<div>
								{appList.map((app) => (
									<div className="admin-app-list" key={app.id}> 
										<div className="admin-app-list-item h5">App Name: {app.appname}<br/>
										Date Created: {app.datecreated}<br/>
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
									<div className="admin-app-list" key={login.username}> 
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
