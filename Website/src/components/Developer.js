import React from 'react';
import axios from 'axios';

import AppList from './AppList';
import DeveloperNewAppButton from './DeveloperNewAppButton';

class Developer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appList: [],
		}
	}

	clearAppList = () => {
		this.setState({ appList: [] });
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

	refreshDeveloper = () => {
		this.componentWillMount();
	}

	render() {
		const { appList } = this.state;
		const appButtonConfig = {
			remove: true,
			install: false,
		}

		return (
			<div>
				<h1 className="page-header">Developer</h1>
				<div className="flex px2">
					<div style={{ flex: 3 }}>
						<AppList
							title="My Creations"
							appList={appList}
							appButtonConfig={appButtonConfig}
						/>	
					</div>
					<div className="flex-column" style={{ flex: 2 }}>
						<DeveloperNewAppButton {...this.props} refreshDeveloper={this.refreshDeveloper}/>
					</div>
				</div>
			</div>
		);
	}
}

export default Developer;
