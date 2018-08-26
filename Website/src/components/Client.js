import React from 'react';
import axios from 'axios';

import RegisterCarModalButton from './RegisterCarModalButton';
import AppList from './AppList';
import AppDetail from './AppDetail';


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
		console.log("SETTING TEXT: ", text);
		this.setState({ successText: text });
	}

	setErrorText = (text) => {
		this.setState({ errorText: text });
	}

	// Grab list of customer's apps
	componentWillMount() {
		axios.get(`${APP_REQUEST_SERVICE}/`)
			.then(response => {
				console.log("SUCCESS", response);
			})
			.catch(err => {
				console.log("ERROR", err);
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
					<span className="text-error-red">{errorText}</span>
					<span className="text-success-green">{successText}</span>
					<div className="flex-none flex justify-around">
						<RegisterCarModalButton { ...this.props } parentFuncs={parentFuncs}/>
					</div>
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
