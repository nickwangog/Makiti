import React from 'react';

// Controls the Left-Hand side List of Apps from the Database

class AppList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			apps: [],
		}
	}

	render() {
		return (
			<div style={this.props.style}>
				<h2>List of Apps</h2>
				<ul>
					{this.props.apps.map(app => (
						<li key={app.id}
							onClick={ () => this.props.onClick(app.id)}>
							<span>{app.name}</span>
							<span>{app.description}</span>
						</li>
					))}
				</ul>
			</div>
		);
	}
}

export default AppList