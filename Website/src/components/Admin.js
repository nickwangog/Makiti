import React from 'react';

class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			empty: 'empty',
		}
	}

	render() {
		return (
			<h2 className="h2">Admin</h2>
		);
	}
}

export default Admin;
