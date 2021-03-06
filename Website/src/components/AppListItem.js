import React from 'react';
import PropTypes from 'prop-types';
import iconImage from '../static/images/app_icon.png';

class AppListItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { app, children } = this.props;
		const { appname, src } = app;

		return (
			<li className="app-list-item">
				<img className="icon-image" src={src} alt="icon"/>
				<div className="app-list-body">
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
