import React from 'react';
import axios from 'axios';
import { Whirlpool } from 'whirlpool-hash';

import InputMakiti from './InputMakiti';
import { account_service } from './AxiosHandler';


//	Basic login form accepts a username and password
class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			firstname: '',
			lastname: '',
			errors: {
				username: '',
				password: '',
				firstname: '',
				lastname: '',
				serverResponse: '',
			},
			showSignUp: false,
		}
	}

	hashPassword = (pass) => {
		let	whirlpool = new Whirlpool(),
			hash = whirlpool.getHash(pass),
			nullRemovedHash = hash.replace(/\0/g, '');
		return nullRemovedHash;
	}

	logIn = (e) => {
		e.preventDefault();

		// Validate form
		if (this.validateForm( () => {

			let { setAccountDetails } = this.props,
				{ username } = this.state,
				password = this.hashPassword(this.state.password),
				clearErrors = this.clearErrors,
				closeParentModal = this.props.onSuccess;

			account_service.post('/account/login', {
					username: username,
					password: password,
				})
				.then(data => {
					sessionStorage.setItem('username', username);
					sessionStorage.setItem('password', password);
					closeParentModal();
					setAccountDetails(data.data);
				})
				.catch(err => {
					const error = err.data;
					this.setSingleError("serverResponse", error ? error.message : err)
				});

		}));
	}

	signUp = (e) => {
		e.preventDefault();
		this.setState({ showSignUp: true }, () => {
			if (this.validateForm(() => {

				let	{ username, firstname, lastname } = this.state,
					password = this.hashPassword(this.state.password),
					{ setAccountDetails } = this.props,
					clearErrors = this.clearErrors,
					closeParentModal = this.props.onSuccess;

				axios.post(`${ACCOUNT_SERVICE}/account/`, {
						username: username,
						password: password,
						firstname: firstname,
						lastname: lastname,
					})
					.then(response => {
						const { data } = response.data;
						// close modal window
						closeParentModal();
						// sets the main Apps current account details
						setAccountDetails(data);
					})
					.catch(err => {
						const { data } = err.response;
						this.setSingleError("serverResponse", data.message);
					});
				}));
		});
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	validateForm = (cb) => {
		let	uErr = '',
			pErr = '',
			fErr = '',
			lErr = '';

		if (!this.state.username.length) {
			uErr = '(required)';
		}
		if (!this.state.password.length) {
			pErr = '(required)'
		}
		if (this.state.showSignUp == true) {
			if (!this.state.firstname.length) {
				fErr = '(required for sign up)';
			}
			if (!this.state.lastname.length) {
				lErr = '(required for sign up)';
			}
		}
		if (uErr.length || pErr.length || fErr.length || lErr.length) {
			this.setState(() => ({
				errors: {
					username: uErr,
					password: pErr,
					firstname: fErr,
					lastname: lErr,
				}
			}));
			return ;
		}
		cb();
	}

	setSingleError = (error, value) => {
		let currentDetails = this.state.errors;
		currentDetails[error] = value;
		this.setState({
			errors: currentDetails,
		}, () => { console.log(`Updated Error (${error}: ${value})\n\n`, this.state) });
	}

	clearErrors = () => (this.setState(() => ({ errors: { username: '', password: '', firstname: '', lastname: '', serverResponse: '',}})));

	render () {
		const { username, password, firstname, lastname, errors } = this.state;
		const { username: uErr,
				password: pErr,
				firstname: fErr,
				lastname: lErr,
				serverResponse } = this.state.errors;

		return (
			<form>
				<span className="flex flex-wrap">
					<h2 className="h2">Login</h2>
					<p className="text-error-red">{serverResponse}</p>
				</span>
				<InputMakiti
					autoFocus
					show={true}
					name="username"
					fieldname="Username"
					errors={uErr}
					value={username}
					onChange={this.onChange}
				/>
				<InputMakiti
					show={true}
					name="password"
					fieldname="Password"
					errors={pErr}
					type="password"
					value={password}
					onChange={this.onChange}
				/>
				<InputMakiti
					show={this.state.showSignUp}
					name="firstname"
					fieldname="First Name"
					errors={fErr}
					value={firstname}
					onChange={this.onChange}
				/>
				<InputMakiti
					show={this.state.showSignUp}
					name="lastname"
					fieldname="Last Name"
					errors={lErr}
					value={lastname}
					onChange={this.onChange}
				/>
				<div className="flex justify-around">
					<button
						className="btn btn-primary button-makiti"
						onClick={this.logIn}
					>
						Login
					</button>
					<button
						className="btn btn-primary button-makiti"
						onClick={this.signUp}
					>
						Sign Up
					</button>
				</div>
				<div className="error-text">
				</div>
			</form>
		);
	}
}

export default LoginForm;
