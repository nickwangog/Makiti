import React from 'react';
import axios from 'axios';

import RegisterCarModalButton from './RegisterCarModalButton';
import AppList from './AppList';
import AppDetail from './AppDetail';

import { app_request_service } from './AxiosHandler';

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

	// Grab list of customer's apps
	componentWillMount() {
		const { id } = this.props.appState.accountDetails;

		app_request_service.get(`/apprequest/customer/${id}`)
			.then(data => {
				this.setState({ appList: data.data })
			})
			.catch(err => {
				let error = err.data;
				error = error ? error.message : err
				this.setState({ errorText: error })
			});
	}

	render () {
		const { appList, currentApp, successText, errorText } = this.state;
		const parentFuncs = {
			setSuccessText: this.setSuccessText,
			setErrorText: this.setErrorText,
		};
		const appButtonConfig = {
			uninstall: true, // Always allow uninstall
		};

		return (
			<div>
				<h1 className="page-header">My Apps</h1>
				<div className="flex flex-column">
					<div className="flex-none flex justify-around">
						<RegisterCarModalButton { ...this.props } parentFuncs={parentFuncs}/>
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
						/>
					</div>
				</div>
			</div>
		);
	}
};

export default Client;
