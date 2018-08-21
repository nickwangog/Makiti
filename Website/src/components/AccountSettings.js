import React from 'react';
import Modal from './Modal';
import ButtonMakiti from './ButtonMakiti';

// Account settings imports
import AccountSettingsDelete from './AccountSettingsDelete';
import AccountSettingsBecomeDeveloper from './AccountSettingsBecomeDeveloper';

class AccountSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
		}
	}

	toggleRedirect = () => ( this.setState(() => ({ redirect: false })) )

	render() {
		const appState = this.props.appState;
		const isLoggedIn = appState.isClient || appState.isDeveloper;

		if (!isLoggedIn) {
			return null;
		} else if (this.state.redirect) {
			return (<Redirect to='/home'/>);
		}

		return (
			<div>
				<h2 className="h2">Account Settings</h2>
				<div className="flex flex-column justify-center">
					<AccountSettingsDelete appState={appState} onDelete={this.toggleRedirect} />
					<AccountSettingsBecomeDeveloper appState={appState} />
				</div>
			</div>
		);
	}
}

export default AccountSettings;