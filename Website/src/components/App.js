import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import axios from 'axios';

// React pages
import PrivateRoute from './PrivateRoute';

// Header
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
			accountDetails: {
				id: 0,
				username: null,
				firstname: null,
				lastname: null,
			},
			logout: this.logout,
			becomeDeveloper: this.becomeDeveloper,
			deleteDeveloper: this.deleteDeveloper,
		};
	}

	authenticateClient = (login, pass) => {
		// Do something to check login and pass
		axios.post(`${API_URL}/account/login`, {
				username: login,
				password: pass,
			})
			.then(response => {
				const { data } = response.data;
				this.setState(() => ({
					isClient: data.customer,
					isDeveloper: data.developer,
					isAdmin: data.admin,
					accountDetails: {
						id: data.id,
						username: data.login,
						firstname: data.firstname,
						lastname: data.lastname,
					}
				}));
			})
			.catch(err => {
				console.log("ERROR", err)
			});
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
		this.setState(() => ({
			isClient: false,
			isDeveloper: false,
			isAdmin: false,
			accountDetails: {
				id: 0,
				username: null,
				firstname: null,
				lastname: null,
			},
		}))
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
