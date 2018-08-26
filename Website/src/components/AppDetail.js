import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { RemoveAppButton, InstallAppButton, LaunchAppVersionButton } from './AppButtons';
import iconImage from '../static/images/app_icon.png'; // TEMPORARY

// import AppIcon from '../static/images/appicon.png';

// Controls the Right-Hand side Detail view of an App from the Database

// Because AppDetail is 'STATE-LESS', it should be a functional component.
// 'Click-handling' should be done at a higher-level and passed down to it

const AppDetail = (props) => {
	// Handle zero-state
	const { className, style, app, appButtonConfig } = props;

	if (!app) {
		return (
			<div
				className={classNames(className)}
				style={style}
			>
				<h3 className={classNames("h3 center app-detail-item-name", className)}>Please select an App to see the Details</h3>
			</div>
		);
	}
		// active: false
		// applicationversion:	0
		// appname: "adsfasdf"
		// datecreated: "2018-08-25T00:05:27.968651+00:00"
		// datelastupdate: null
		// description: "asdf"
		// id: 2

	const { active, applicationversion, appname, datecreated, datelastupdate, description } = app;

	console.log(app);
	let temp = Date.parse(datecreated)
	let date = new Date(temp);
	let formattedCreate = date.toLocaleString()
	// let temp = Date.parse(datelastupdate)
	// let date = new Date(temp);
	// let formattedUpdate = date.toLocaleString()
	//replace datelastupdate with formattedUpdate

	// Handle regular state
	return (
		<div style={style} className={classNames('rounded', className)}>
			<h3 className="h3 underline">
				{appname}
			</h3>
			<img className="icon-image" src={iconImage} alt="icon"/>
			<div>
				<span>Created: {formattedCreate}</span>
				<span>Last Updated: {datelastupdate}</span>
				<span>Version: {applicationversion}</span>
				<span className="underline">App Description: {applicationversion}</span>
				<span className={classNames('app-description', className)}>{description}</span>
			</div>
			<div className="flex flex-center">
				<RemoveAppButton show={appButtonConfig.remove} app={app} />
				<InstallAppButton show={appButtonConfig.install} app={app} />
				<LaunchAppVersionButton show={appButtonConfig.launch} app={app} />
			</div>
		</div>
	);
};

// Defining the prop types for the component for clarity purposes
AppDetail.propTypes = {
	style: PropTypes.object,
	className: PropTypes.string,
	app: PropTypes.object,
};

export default AppDetail;
