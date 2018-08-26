import React from 'react';
import axios from 'axios';

import AppList from './AppList';
import AppDetail from './AppDetail';
import DeveloperNewAppButton from './DeveloperNewAppButton';

import { application_service } from './AxiosHandler';

class Developer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appList: [],
			currentApp: null,
			logFile: '',
			devSuccessText: '',
			devErrText: '',
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

	getAppList = (id) => {
		application_service.get(`/application/developer/${id}`)
			.then(data => {
				let newData = data.data.map(app => (app.appDetails));
				this.setState(() => ({ appList: newData }));
			})
			.catch(err => {
				// APPLICATION SERVICE UNREACHABLE
				this.clearAppList();
				this.setErrorText("App service unreachable");
			});
	}

	componentWillMount() {
		let { id } = this.props.appState.accountDetails;
		this.getAppList(id);
	}

	setSuccessText = (text) => {
		this.setState({ devSuccessText: text, devErrText: '' });
	}

	setErrorText = (text) => {
		this.setState({ devErrText: text, devSuccessText: '' });
	}

	refreshDeveloper = () => {
		this.componentWillMount();
	}

	showAppDetail = (appId) => {
		const { appList } = this.state;

		let chosenApp = appList.filter(app => app.id == appId)[0];
		this.setState({
			currentApp: chosenApp,
			remove: true, // chosenApp.active,
			launch: true, // chosenApp.appversionDetails.status == 4,
			update: true, // chosenApp.active && chosenApp.runningversion != 0,
		});
		const { appname } = chosenApp;
		const { version } = chosenApp.appversionDetails;
		this.getLogFile(`${appname}__${version}`);
	}

	clearAppList = () => {
		this.setState({ appList: [] });
	}

	render() {
		const { appList, currentApp, logFile, devSuccessText, devErrText } = this.state;
		const { appState } = this.props;
		const appButtonConfig = {
			remove: this.state.remove,
			install: this.state.install,
			launch: this.state.launch,
			update: this.state.update,
		}
		const parentFuncs = {
			refreshDeveloper: this.refreshDeveloper,
			setSuccessText: this.setSuccessText,
			setErrorText: this.setErrorText,
		}

		return (
			<div>
				<h1 className="page-header">Developer</h1>
				<div className="flex flex-column">
					<span className="text-error-red">{devErrText}</span>
					<span className="text-success-green">{devSuccessText}</span>
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
