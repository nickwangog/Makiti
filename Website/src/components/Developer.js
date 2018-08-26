import React from 'react';
import axios from 'axios';

import AppList from './AppList';
import AppDetail from './AppDetail';
import DeveloperNewAppButton from './DeveloperNewAppButton';

import { application_service, app_request_service } from './AxiosHandler';

class Developer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appList: [],
			currentApp: null,
			logFile: '',
			successText: '',
			errorText: '',
			launch: false,
			install: false,
			remove: false,
			update: false,
		}
	}

	// Grab the log file
	getLogFile = (logFilePath) => {
		app_request_service.get(`/apprequest/logfile/${logFilePath}`)
			.then(data => {
				this.setState({ logFile: data, errorText: ''});
			})
			.catch(err => {
				this.setState({ devErrorText: err.data || err });
			});
	}

	getAppList = (id, onSuccess) => {
		application_service.get(`/application/developer/${id}`)
			.then(data => {
				let newData = data.data.map(app => (app.appDetails));
				this.setState(() => ({ appList: newData }), () => {
					if (onSuccess) {
						onSuccess()
					}
				});
			})
			.catch(err => {
				// APPLICATION SERVICE UNREACHABLE
				let error = err.data;
				error = error ? error.message : err;
				this.clearAppList();
				this.setErrorText(error);
			});
	}

	componentWillMount() {
		let { id } = this.props.appState.accountDetails;
		this.getAppList(id);
	}

	setSuccessText = (text) => {
		this.setState({ successText: text, errorText: '' });
	}

	setErrorText = (text) => {
		this.setState({ errorText: text, successText: '' });
	}

	refreshDeveloper = (appId) => {
		let { id } = this.props.appState.accountDetails;
		this.getAppList(id, () => {
			if (appId) {
				this.showAppDetail(appId);
			}
		});
	}

	showAppDetail = (appId) => {
		const { appList } = this.state;

		console.log("APPLIST", appList);
		console.log("APPID", appId);
		let chosenApp = appList.filter(app => app.id == appId)[0];
		this.setState({
			currentApp: chosenApp,
			remove: true, // chosenApp.active,
			launch: chosenApp.appversionDetails.status == 4,
			update: chosenApp.active && chosenApp.runningversion != 0,
		});
		const { appname } = chosenApp;
		const { version } = chosenApp.appversionDetails;
		this.getLogFile(`${appname}__${version}`);
	}

	clearAppList = () => {
		this.setState({ appList: [] });
	}

	render() {
		const { appList, currentApp, logFile, successText, errorText } = this.state;
		const { appState } = this.props;
		const appButtonConfig = {
			remove: this.state.remove,
			install: this.state.install,
			launch: this.state.launch,
			update: this.state.update,
		}
		const parentFuncs = {
			refreshDeveloper: this.refreshDeveloper,
			showAppDetail: this.showAppDetail,
			setSuccessText: this.setSuccessText,
			setErrorText: this.setErrorText,
		}

		console.log("CURRENTAPP", currentApp);

		return (
			<div>
				<h1 className="page-header">Developer</h1>
				<div className="flex flex-column">
					<span className="text-error-red">{errorText}</span>
					<span className="text-success-green">{successText}</span>
					<div className="flex-none flex justify-around">
						<DeveloperNewAppButton {...this.props} parentFuncs={parentFuncs}/>
					</div>
					<div className="flex-none flex">
						<AppList
							style={{ flex: 2 }}
							title="My Creations"
							appList={appList}
							onClick={this.showAppDetail}
						/>
						<AppDetail
							style={{ flex: 3 }}
							app={currentApp}
							logFile={logFile}
							appButtonConfig={appButtonConfig}
							parentFuncs={parentFuncs}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Developer;
