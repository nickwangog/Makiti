import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

// React pages
import Header from './Header';
import Home from './Home';
import Developer from './Developer';
import Admin from './Admin';
import Client from './Client';
import NotFound from './NotFound';

// Main App handles the Routing
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
				<main>
					<Header />
					<Switch>
						<Route exact path="/" component={Home}/>
						<Route path="/developer" component={Developer}/>
						<Route path="/admin" component={Admin}/>
						<Route path="/client" component={Client}/>
						<Route component={NotFound}/>
					</Switch>
				</main>
			</BrowserRouter>
		);
	}
}

export default App;