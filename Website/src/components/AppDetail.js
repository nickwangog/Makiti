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
	const { className, style, app, appButtonConfig, appState, logFile, parentFuncs } = props;

	console.log(props);
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

	const { active, applicationversion, appname, datecreated, datelastupdate, description } = app;

	// Handle regular state
	return (
		<div style={style} className={classNames('rounded', className)}>
			<h3 className="h3 underline">
				{appname}
			</h3>
			<img className="icon-image" src={iconImage} alt="icon"/>
			<div>
				<span>Created: {datecreated}</span>
				<span>Last Updated: {datelastupdate}</span>
				<span>Version: {applicationversion}</span>
				<span className="underline">App Description: {applicationversion}</span>
				<span className={classNames('app-description', className)}>{description}</span>
			</div>
			<div className="flex flex-center">
				<RemoveAppButton show={appButtonConfig.remove} app={app} parentFuncs={parentFuncs}/>
				<InstallAppButton show={appButtonConfig.install} app={app} appState={appState} />
				<LaunchAppVersionButton show={appButtonConfig.launch} app={app} logFile={logFile} />
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
