import React from 'react';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';

import { application_service } from './AxiosHandler';

class LaunchAppModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errorText: '',
		}
	}

	launchApp = () => {
		const { parentFuncs, toggle, app } = this.props;
		const { id } = app.appversionDetails;

		console.log(app);

		application_service.put(`/application/${id}/launch`)
			.then(data => {
				parentFuncs.setSuccessText(data.data.message);
				parentFuncs.refreshDeveloper(app.app);
				toggle();
			})
			.catch(err => {
				let error = err.data;
				error = error ? error.message : err;
				this.setState({ errorText: error } );
			});
	}

	render() {
		const { errorText } = this.state;
		const { show, toggle, app, logFile } = this.props;

		if (!app.appversionDetails) {
			console.log("wont open");
			return null;
		}

		const { app: id } = app.appversionDetails;

		return (
			<div className="center">
				<Modal
					show={show}
					onClose={toggle}
					style={{width: 300}}
				>
					<div>
						<span className="text-error-red">{errorText}</span>
						<h5 className="h5">Log File of Application Testing</h5>
						<textarea
							name="text"
							rows="14"
							cols="20"
							wrap="soft"
							name="appDescription"
							style={{ height: 100, width: 200 }}
							value={logFile}
							readOnly={true}
						/>
						<ButtonMakiti
							className="text-bold-black bg-green"
							onClick={this.launchApp}
						>
							Launch to the App Store!
						</ButtonMakiti>
					</div>
				</Modal>
			</div>
		);
	}
}

export default LaunchAppModal;
