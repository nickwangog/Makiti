import axios from 'axios';
import React from 'react';

import AppList from './AppList';
import AppDetail from './AppDetail';
import LoginForm from './LoginForm';

import { application_service, app_request_service } from './AxiosHandler';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appList: [],
			currentApp: null,
			successText: '',
			errorText: '',
			install: false,
		};
	}

	setSuccessText = (text) => {
		this.setState({ successText: text, errorText: '' });
	}

	setErrorText = (text) => {
		this.setState({ errorText: text, successText: '' });
	}

	getAppList = () => {
		application_service.get(`/application/`)
			.then(data => {
				let activeApps = data.data.filter(app => app.active == true && app.runningversion > 0);
				this.setState({ appList: activeApps, successText: '', errorText: '', currentApp: null });
			})
			.catch(err => {
				let error = err.data;
				error = error ? err.message : err;
				this.setState({ appList: [], currentApp: null, successText: '', errorText: error });
			});
	}

	// Get a list of Apps in the App store
	componentDidMount() {
		this.getAppList();
	}

	getCustomerApps = (id, onSuccess, onFail) => {
		app_request_service.get(`/apprequest/customer/${id}`)
			.then(data => {
				onSuccess(data);
			})
			.catch(err => {
				let error = err.data;
				error = error ? error.message : err;
				onFail(error);
			})
	}

	showAppDetail = (appId) => {
		const { id } = this.props.appState.accountDetails;

		let chosenApp = this.state.appList.filter(app => app.id == appId)[0];

		this.getCustomerApps(id, (data) => {
			let customerApp = data.data.filter(app => app.appversion == appId);
			this.setState({
				currentApp: chosenApp,
				install: customerApp.length == 0,
			});
			}, (error) => {
				this.setState({
					currentApp: chosenApp,
					install: true,
			});
		});
	}

	render() {
		const { appList, currentApp, errorText, successText } = this.state;
		const { appState } = this.props;

		const appButtonConfig = {
			install: this.state.install,
		};

		const parentFuncs = {
			setSuccessText: this.setSuccessText,
			setErrorText: this.setErrorText,
			showAppDetail: this.showAppDetail,
		}

		return (
			<div>
				<h1 className="page-header">Home</h1>
				<div className="flex flex-column">
					<span className="text-error-red">{errorText}</span>
					<span className="text-success-green">{successText}</span>
					<div className="flex-none flex">
						<AppList
							className="flex-auto"
							style={{ flex: 2 }}
							title="App Store"
							appList={appList}
							onClick={this.showAppDetail}
						/>
						<AppDetail
							className="flex-auto"
							style={{ flex: 3 }}
							app={currentApp}
							appState={appState}
							appButtonConfig={appButtonConfig}
							parentFuncs={parentFuncs}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
