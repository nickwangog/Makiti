import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';

// React pages
import PrivateRoute from './PrivateRoute';
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
			isClient: false,
			isDeveloper: false,
			isAdmin: false,
		};
	}

	authenticateClient = (login, pass, cb) => {
		// Do something to check login and pass
		this.setState((state) => (
			{ isClient: true }
		));
		if (this.state.isClient == true) {
			cb();
		}
	}

	deAuthenticateClient = () => {
		// Do something to check login and pass
		this.setState((state) => (
			{ isClient: false }
		));
	}

	authenticateDeveloper = (login, pass) => {
		// Do something to check login and pass
		this.setState((state) => (
			{ isDeveloper: true }
		));
	}

	deAuthenticateDeveloper = () => {
		// Do something to check login and pass
		this.setState((state) => (
			{ isDeveloper: false }
		));
	}

	authenticateAdmin = (login, pass) => {
		// Do something to check login and pass
		this.setState((state) => (
			{ isAdmin: true }
		));
	}

	deAuthenticateAdmin = () => {
		// Do something to check login and pass
		this.setState((state) => (
			{ isAdmin: false }
		));
	}

	render() {
		const { isClient, isDeveloper, isAdmin } = this.state;
		const authFunc = {
			authClient: this.authenticateClient,
			deAuthClient: this.deAuthenticateClient,
			authDev : this.authenticateDeveloper,
			deAuthDev: this.deAuthenticateDeveloper,
			authAdmin: this.authenticateAdmin,
			deAuthAdmin: this.deAuthenticateAdmin,
		}

		return (
			<Router>
				<main>
					<Header {...this.state} authFunc={authFunc} />
					<Switch>
						<Route exact path="/" component={Home} />
						<Redirect from="/home" to="/" />
						<PrivateRoute path="/client" component={Client} accessCheck={isClient} />
						<PrivateRoute path="/developer" component={Developer} accessCheck={isDeveloper} />
						<PrivateRoute path="/admin" component={Admin} accessCheck={isAdmin} />
						<Route component={NotFound} />
					</Switch>
				</main>
			</Router>
		);
	}
}

export default App;
