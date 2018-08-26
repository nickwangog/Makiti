import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import { Whirlpool } from 'whirlpool-hash';

// React pages
import PrivateRoute from './PrivateRoute';

// Header
import Header from './Header';

// Footer
import Footer from './Footer';

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
			accountDetails: {
				id: 0,
				username: null,
				firstname: null,
				lastname: null,
				customer: false,
				developer: false,
				admin: false,
			},
			setAccountDetails: this.setAccountDetails,
			clearAccountDetails: this.clearAccountDetails,
			updateAccountDetail: this.updateAccountDetail,
			becomeDeveloper: this.becomeDeveloper,
			deleteDeveloper: this.deleteDeveloper,
		};
	}

	setAccountDetails = (data) => {
		this.setState(() => ({
			accountDetails: {
				id: data.id,
				username: data.login,
				firstname: data.firstname,
				lastname: data.lastname,
				customer: data.customer,
				developer: data.developer,
				admin: data.admin,
			}
		}));
	}

	clearAccountDetails = () => {
		this.setState(() => ({
			accountDetails: {
				id: 0,
				username: null,
				firstname: null,
				lastname: null,
				customer: false,
				developer: false,
				admin: false,
			},
		}));
	}

	updateAccountDetail = (field, value) => {
		let currentDetails = { ...this.state.accountDetails };
		currentDetails[field] = value;

		this.setState({
			accountDetails: currentDetails,
		}, () => { console.log(`Updated Account Detail (${field}: ${value})\n\n`, this.state) });
	}

	becomeDeveloper = () => {
		// Insert functionality to become developer
		this.setState(() => ({ isDeveloper: true }));
	}

	deleteDeveloper = () => {
		this.setState(() => ({ isDeveloper: false }))
	}

	// // Check if user is logged in and log them in automatically
	// componentWillMount() {
	// 	const { username, password } = sessionStorage;

	// 	if (username && password) {
	// 		let { setAccountDetails } = this.props,
	// 			{ username } = this.state,
	// 			password = this.hashPassword(this.state.password),
	// 			clearErrors = this.clearErrors,
	// 			closeParentModal = this.props.onSuccess;
			
	// 		let hashPassword = (pass) => {
	// 			let	whirlpool = new Whirlpool(),
	// 				hash = whirlpool.getHash(pass),
	// 			return hash.replace(/\0/g, '');
	// 		}

	// 		axios.post(`${ACCOUNT_SERVICE}/account/login`, {
	// 				username: username,
	// 				password: password,
	// 			})
	// 			.then(response => {
	// 				const { data } = response.data;
	// 				// sets the main Apps current account details
	// 				this.setAccountDetails(data);
	// 			})
	// 			.catch(err => {
	// 				// On failure, type out what went wrong
	// 				if (!err.response) {
	// 					return this.setSingleError("serverResponse", "Account Services are Offline at the moment");
	// 				}
	// 				const { data } = err.response;
	// 			});
	// 	}
	// }

	render() {
		const { customer: isCus, developer: isDev, admin: isAd } = this.state.accountDetails;
		const isCusOrDev = isCus || isDev;

		return (
			<Router>
				<main>
					<Header {...this.state} />
					<Switch>
						<Route exact path="/" render={() => (<Home appState={this.state} />)} />
						<Redirect from="/home" to="/" />
						<PrivateRoute path="/client" accessCheck={isCus} render={() => (<Client appState={this.state} />)} />
						<PrivateRoute path="/developer" accessCheck={true} render={() => (<Developer appState={this.state} />)} />
						<PrivateRoute path="/admin" accessCheck={isAd} render={() => (<Admin appState={this.state} />)}  />
						<PrivateRoute path="/accountsettings" accessCheck={isCus} render={() => (<AccountSettings appState={this.state} />)} />
						<Route component={NotFound} />
					</Switch>
					<Footer/>
				</main>
			</Router>
		);
	}
}

export default App;
