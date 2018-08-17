import React from 'react';
import PropTypes from 'prop-types';

// Controls the Left-Hand side List of Apps from the Database

class AppList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			apps: [],
		};
	}

	render() {
		return (
			<div style={this.props.style}>
				<h2 className="h2">List of Apps</h2>
				<ul className="list-reset">
					{this.props.apps.map(app => (
						<li
							key={app.id}
							onClick={() => this.props.onClick(app.id)}
							className="py3 border-bottom border-bottom-smoke pointer"
						>
							<span>{app.name}</span>
							<span>{app.description}</span>
						</li>
					))}
				</ul>
			</div>
		);
	}
}

// Defining the prop types for the component for clarity purposes
AppList.propTypes = {
	style: PropTypes.object,
	apps: PropTypes.array,
	onClick: PropTypes.func,
};

export default AppList;
