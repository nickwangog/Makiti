import React from 'react';

import Modal from './Modal';
import ButtonMakiti from './ButtonMakiti';

// Account settings imports
import AccountSettingsDelete from './AccountSettingsDelete';
import AccountSettingsBecomeDeveloper from './AccountSettingsBecomeDeveloper';

class AccountSettings extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const appState = this.props.appState;

		return (
			<div>
				<h1 className="page-header">Account Settings</h1>
				<div className="flex flex-column justify-center">
					<AccountSettingsDelete appState={appState} />
					<AccountSettingsBecomeDeveloper appState={appState} />
				</div>
			</div>
		);
	}
}

export default AccountSettings;