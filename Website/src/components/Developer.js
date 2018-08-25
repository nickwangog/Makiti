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

	componentWillMount() {
		let { id } = this.props.appState.accountDetails;

		axios.get(`${APPLICATION_SERVICE}/application/developer/${id}`)
			.then(response => {
				const { data } = response.data;
				let newData = data.map(app => (app.appDetails));
				this.setState(() => ({ appList: newData }));
				console.log(newData);
			})
			.catch(err => {
				// APPLICATION SERVICE UNREACHABLE
				this.setState({ appList: [] });
				if (!err.response) {
					console.log("no response from server");
					return ;
				}
				const { data } = err.response;
			});
	}

	render() {
		const { appList } = this.state;

		return (
			<div>
				<h1 className="page-header">Developer</h1>
				<div className="flex px2">
					<div style={{ flex: 3 }}>
						<AppList title="My Creations" appList={appList}/>	
					</div>
					<div className="flex-column" style={{ flex: 2 }}>
						<DeveloperNewAppButton {...this.props}/>
					</div>
				</div>
			</div>
		);
	}
}

export default Developer;
