import React from 'react';
import axios from 'axios';

import RegisterCarModalButton from './RegisterCarModalButton';
import AppList from './AppList';
import AppDetail from './AppDetail';

import { application_service } from './AxiosHandler';

import makiti_icon from '../static/images/makiti_icon.png';


class Client extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appList: [],
			currentApp: null,
			successText: '',
			errorText: '',
		}
	}

	setSuccessText = (text) => {
		this.setState({ successText: text });
	}

	setErrorText = (text) => {
		this.setState({ errorText: text });
	}

	getCustomerApps = () => {
		const { id } = this.props.appState.accountDetails;

		application_service.get(`/application/customer/${id}`)
			.then(data => {

				let newData = data.data.map(app => {
					// Just get the app Details
					let appDets = app;

					// Get the Icon
					return application_service.get(`/application/appicon/${app.id}`)
						.then(icondata => {
							icondata = icondata.data.slice(1, -1);
							appDets.src = `data:image/png;base64,${icondata}`;
							return appDets;
						})
						.catch(err => {
							appDets.src = makiti_icon;
							return appDets;
						});
					});

				// Wait for all icon requests to finish, then set the state
				Promise.all(newData).then(completed => {
					this.setState({ appList: completed });
				});

			})
			.catch(err => {
				let error = err.data;
				error = error ? error.message : err
				this.setState({ errorText: error })
			});
	}

	showAppDetail = (appId) => {
		const { appList } = this.state;

		let chosenApp = appList.filter(app => app.id == appId)[0];
		this.setState({
			currentApp: chosenApp,
		});
	}

	// Grab list of customer's apps
	componentWillMount() {
		this.getCustomerApps();
	}

	render () {
		const { appList, currentApp, successText, errorText } = this.state;
		const parentFuncs = {
			setSuccessText: this.setSuccessText,
			setErrorText: this.setErrorText,
		};
		const appButtonConfig = {
			uninstall: true,
		};

		return (
			<div>
				<h1 className="page-header">My Apps</h1>
				<div className="flex flex-column">
					<div className="flex-none flex justify-around">
						<RegisterCarModalButton { ...this.props } parentFuncs={parentFuncs} />
					</div>
					<span className="text-error-red center">{errorText}</span>
					<span className="text-success-green center">{successText}</span>
					<div className="flex-none flex">
						<AppList
							style={{ flex: 2 }}
							title="My Apps"
							appList={appList}
							onClick={this.showAppDetail}
						/>
						<AppDetail
							style={{ flex: 3 }}
							app={currentApp}
							appButtonConfig={appButtonConfig}
							parentFuncs={parentFuncs}
						/>
					</div>
				</div>
			</div>
		);
	}
};

export default Client;
