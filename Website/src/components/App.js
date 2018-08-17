import React from 'react';
import { BrowserRouter } from 'react-router-dom';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			something: 'something',
		};
	}

	render() {
		return (
			<BrowserRouter>
				<Route path="/" Component={Home}/>
			</BrowserRouter>
		);
	}
}