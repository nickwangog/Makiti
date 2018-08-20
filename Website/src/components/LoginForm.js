import React from 'react';

//	A helper element for both the username and password
const LoginInput = ({
	...props
}) => {
	const { name } = {...props}
	return (
		<div className="px2 fit max-width-1">
			<h5 className="h5">{name}</h5>
			<input
				className=""
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
			errors: {},
		}
	}

	onSubmit = (e) => {
		e.preventDefault();
		const { authClient, authDeveloper, authAdmin } = this.props.authFunc;
		authClient(this.state.username, this.state.password);
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
				<h2 className="h2 px2 flex">Login</h2>
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
				<button
					className="btn btn-primary button-makiti"
					onClick={this.onSubmit}
				>
					Login
				</button>
			</form>
		);
	}
}

export default LoginForm;
