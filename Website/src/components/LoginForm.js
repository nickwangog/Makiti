import React from 'react';

//	A helper element for both the username and password
const LoginInput = ({
	...props
}) => {
	const { name } = {...props}
	return (
		<div className="fit">
			<h5 className="h5">{name}</h5>
			<input
				className="login-input"
				{...props}
			/>
		</div>
	);
}


//	Basic login form accepts a username and password
class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			errors: {
				username: null,
				password: null,
			},
		}
	}

	onSubmit = (e) => {
		e.preventDefault();
		const { authClient, authDeveloper, authAdmin } = this.props.authFunc;
		authClient(this.state.username, this.state.password);
		// If successful close the parent modal
		if (true) { // success placeholder)
			this.props.onSuccess();
		}
	}

	signUp = (e) => {
		e.preventDefault();
		console.log(e);
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	validateForm = () => {
		return true;
	}

	render () {
		const { username, password, errors } = this.state;

		return (
			<form>
				<h2 className="h2">Login</h2>
				<LoginInput
					autoFocus
					name="username"
					value={username}
					onChange={this.onChange}
				/>
				<LoginInput
					name="password"
					type="password"
					value={password}
					onChange={this.onChange}
				/>
				<div className="flex justify-around">
					<button
						className="btn btn-primary button-makiti"
						onClick={this.onSubmit}
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
