import React from 'react';
import PropTypes from 'prop-types';

class AppListItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { app } = this.props;
		const { appname, description, version } = app;

		console.log("APP_LIST_ITEM", app);

		return (
			<li className="flex flex-column py2 app-list-item">
				<span className="app-list-item-name">{appname}</span>
				<span>{description}</span>
				<span>{version}</span>
			</li>
		);
	}
}

// Defining the prop types for the component for clarity purposes
AppListItem.propTypes = {
	app: PropTypes.object,
};

export default AppListItem;
