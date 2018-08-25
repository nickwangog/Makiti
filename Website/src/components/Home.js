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
		};
	}

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

	showAppDetail = (idx) => {
		this.setState({currentApp: this.state.appList[idx]});
	}

	render() {
		const { appList, currentApp } = this.state;
		const { appState } = this.props;
		// From home, don't show remove button
		// only allow install if user is logged in
		const appButtonConfig = {
			remove: false,
			install: false,
		};

		return (
			<div>
				<main className="flex flex-column">
					<h1 className="page-header">Home</h1>
					<div className="flex-none flex">
						<AppList
							className="flex-auto"
							title="App Store"
							appList={appList}
							appButtonConfig={appButtonConfig}
							onClick={this.showAppDetail}
						/>
						<AppDetail
							className="flex-auto"
							app={currentApp}
						/>
					</div>
				</main>
			</div>
		);
	}
}

export default Home;
