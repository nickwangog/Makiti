import React from 'react';
import axios from 'axios';

import AppList from './AppList';
import AppDetail from './AppDetail';
import DeveloperNewAppButton from './DeveloperNewAppButton';

class Developer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appList: [],
			currentApp: null,
			devSuccessText: '',
			devErrText: '',
			launch: false,
			install: false,
			remove: false,
			update: false,
		}
	}

	componentWillMount() {
		let { id } = this.props.appState.accountDetails;

		axios.get(`${APPLICATION_SERVICE}/application/developer/${id}`)
			.then(response => {
				const { data } = response.data;
				let newData = data.map(app => (app.appDetails));
				this.setState(() => ({ appList: newData }));
			})
			.catch(err => {
				// APPLICATION SERVICE UNREACHABLE
				this.clearAppList();
				if (!err.response) {
					console.log("no response from server");
					return ;
				}
				const { data } = err.response;
			});
	}

	setDevSuccessText = (text) => {
		this.setState({ devSuccessText: text });
	}

	setDevErrText = (text) => {
		this.setState({ devErrText: text });
	}

	refreshDeveloper = () => {
		this.componentWillMount();
	}

	showAppDetail = (appId) => {
		const { appList } = this.state;

		let chosenApp = appList.filter(app => app.id == appId);
		this.setState({
			currentApp: chosenApp[0],
			remove: true, // chosenApp[0].active,
			launch: true, // chosenApp[0].appversionDetails.status == 4,
			update: true, // chosenApp[0].active && currentApp[0].runningversion != 0,
		});
	}

	clearAppList = () => {
		this.setState({ appList: [] });
	}

	render() {
		const { appList, currentApp } = this.state;
		const { appState } = this.props;
		const appButtonConfig = {
			remove: this.state.remove,
			install: this.state.install,
			launch: this.state.launch,
			update: this.state.update,
		}
		const parentFuncs = {
			refreshDeveloper: this.refreshDeveloper,
			setDevSuccessText: this.setDevSuccessText,
			setDevErrText: this.setDevErrText,
		}

		return (
			<div>
				<h1 className="page-header">Developer</h1>
				<div className="flex flex-column">
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
							appButtonConfig={appButtonConfig}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Developer;
