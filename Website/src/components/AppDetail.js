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
			<p
				style={props.style}
				className={classNames('h4 bg-white italic center', props.className)}
			>
				<span>Please select an App to see the Details</span>
			</p>
		);
	}

	// Handle regular state
	return (
		<div style={props.style} className={classNames('bg-white', props.className)}>
			<h3 className="h3">
				{props.app.name}
			</h3>
			<img
				className="fit"
				alt={props.app.name}
				src={props.app.image}
			/>
			<div>
				<span>{props.app.description}</span>
				<span>{props.app.category}</span>
			</div>
			<h4>Application Details</h4>
			<h5>{`Rating: ${props.app.rating}/5`}</h5>
			<ul>
				{props.app.howTo.map(how => (
					<li key={how}>
						{how}
					</li>))}
			</ul>
			<h4>Installation</h4>
			<ol>
				<li>Press Install</li>
				<li>Profit!</li>
			</ol>
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
