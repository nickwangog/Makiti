import axios from 'axios';
import React from 'react';

import AppList from './AppList';
import AppDetail from './AppDetail';
import LoginForm from './LoginForm';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appList: [],
			currentApp: null,
			successText: '',
			errorText: '',
		};
	}

	setSuccessText = (text) => {
		this.setState({ successText: text, errorText: '' });
	}

	setErrorText = (text) => {
		this.setState({ errorText: text, successText: '' });
	}

	// Get a list of Apps in the App store
	componentDidMount() {
		axios.get(`${APPLICATION_SERVICE}/application/`)
			.then(response => {
				const { data } = response.data;
				console.log(data);
				this.setState({ appList: data });
			})
			.catch(err => {
				// APPLICATION SERVICE UNREACHABLE
				this.setState({ appList: [], currentApp: null });
				if (!err.response) {
					console.log("no response from server");
					return ;
				}
				const { data } = err.response;
				console.log(data);
			});
	}

	showAppDetail = (appId) => {
		const { appList } = this.state;

		let chosenApp = appList.filter(app => app.id == appId);
		this.setState({currentApp: chosenApp[0]});
	}

	render() {
		const { appList, currentApp } = this.state;
		const { appState } = this.props;
		// From home, don't show remove button
		// only allow install if user is logged in
		const appButtonConfig = {
			remove: false, //
			install: true, // install if 
			launch: false, //
		};

		const parentFuncs = {
			setSuccessText: this.setSuccessText,
			setErrorText: this.setErrorText,
		}

		return (
			<div>
				<main className="flex flex-column">
					<h1 className="page-header">Home</h1>
					<div className="flex-none flex">
						<AppList
							className="flex-auto"
							style={{ flex: 2.5 }}
							title="App Store"
							appList={appList}
							onClick={this.showAppDetail}
						/>
						<AppDetail
							className="flex-auto"
							style={{ flex: 2 }}
							app={currentApp}
							appState={appState}
							appButtonConfig={appButtonConfig}
							parentFuncs={parentFuncs}
						/>
					</div>
				</main>
			</div>
		);
	}
}

export default Home;
