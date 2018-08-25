import React from 'react';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';

class LaunchAppModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errorText: '',
			appVersionId: 0,
		}
	}

	launchApp = (appVersionId) => {
		axios.post(`${APPLICATION_SERVICE}/application/${appVersionId}/launch`)
		.then(response => {
			const { data } = response.data;
		})
		.catch(err => {
			if (!err.response) {
				console.log("no response from server");
				return ;
			}
		});
	}

	componentWillMount() {

	}

	render() {
		const { errorText, appVersionId } = this.state;
		const { show, toggle, app } = this.props;

		console.log(app);

		return (
			<div className="center">
				<Modal
					show={show}
					onClose={toggle}
					style={{width: 300}}
				>
					<ButtonMakiti
						className="text-bold-black bg-green"
						onClick={() => this.launchApp(appVersionId)}
					>
						Launch App!
					</ButtonMakiti>
				</Modal>
			</div>
		);
	}
}

export default LaunchAppModal;
