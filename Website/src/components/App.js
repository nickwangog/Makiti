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

// Main Routes
import Home from './Home';
import Client from './Client';
import Developer from './Developer';
import Admin from './Admin';
import AccountSettings from './AccountSettings';

// Not found route
import NotFound from './NotFound';



// Main App handles the Routing
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isClient: false,
			isDeveloper: false,
			isAdmin: false,
			logout: this.logout,
			becomeDeveloper: this.becomeDeveloper,
			deleteDeveloper: this.deleteDeveloper,
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

	logout = () => {
		this.setState({
			isClient: false,
			isDeveloper: false,
			isAdmin: false,
		})
	}

	becomeDeveloper = () => {
		// Insert functionality to become developer
		this.setState(() => ({ isDeveloper: true }));
	}

	deleteDeveloper = () => {
		this.setState(() => ({ isDeveloper: false }))
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
		const isClientOrDev = isClient || isDeveloper;

		return (
			<Router>
				<main>
					<Header {...this.state} authFunc={authFunc} />
					<Switch>
						<Route exact path="/" component={Home} />
						<Redirect from="/home" to="/" />
						<PrivateRoute path="/client" accessCheck={isClient} component={Client} />
						<PrivateRoute path="/developer" accessCheck={isDeveloper} component={Developer} />
						<PrivateRoute path="/admin" accessCheck={isAdmin} component={Admin}  />
						<PrivateRoute path="/accountsettings" accessCheck={isClient} render={() => (<AccountSettings appState={this.state} />)} accessCheck={isClientOrDev} />
						<Route component={NotFound} />
					</Switch>
				</main>
			</Router>
		);
	}
}

export default App;
