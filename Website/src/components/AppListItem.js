import React from 'react';
import PropTypes from 'prop-types';

class AppListItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { app, children } = this.props;
		const { appname } = app;

		return (
			<li className="flex flex-column py2 app-list-item">
				<div>
					<span className="app-list-item-name">{appname}</span>
				</div>
				<div>
					{children}
				</div>
			</li>
		);
	}
}

// Defining the prop types for the component for clarity purposes
AppListItem.propTypes = {
	app: PropTypes.object,
};

export default AppListItem;
