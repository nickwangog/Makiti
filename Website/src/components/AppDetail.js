import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// import AppIcon from '../static/images/appicon.png';

// Controls the Right-Hand side Detail view of an App from the Database

// Because AppDetail is 'STATE-LESS', it should be a functional component.
// 'Click-handling' should be done at a higher-level and passed down to it

const AppDetail = (props) => {
	// Handle zero-state
	if (!props.app) {
		return (
			<div className={classNames('h4 italic center rounded', props.className)}>
				<span>Please select an App to see the Details</span>
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

	const { active, applicationversion, appname, datecreated, datelastupdate, description } = props.app;

	// Handle regular state
	return (
		<div style={props.style} className={classNames('rounded', props.className)}>
			<h3 className="h3">
				{appname}
			</h3>
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
