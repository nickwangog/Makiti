import React from 'react';
import {
	Route,
	Redirect,
} from 'react-router-dom';

class PrivateRoute extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			'something': 'something',
		};
	}

	render() {
		const { accessCheck, ...routeStuff } = this.props;

		if (!accessCheck) {
			return (
				<Redirect to='/home' />
			);
		}

		return (
			<Route {...routeStuff} />
		);
	}
}

export default PrivateRoute;
