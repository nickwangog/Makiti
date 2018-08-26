import React from 'react';
import axios from 'axios';

import ButtonMakiti from './ButtonMakiti';
import Modal from './Modal';

class LaunchAppModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errorText: '',
			logFile: '',
		}
	}

	launchApp = (appVersionId) => {
		axios.put(`${APPLICATION_SERVICE}/application/${appVersionId}/launch`)
			.then(response => {
				console.log("SUCCESSS", response);
				const { data } = response.data;
				console.log(data);
			})
			.catch(err => {
				if (!err.response) {
					return this.setState({ errorText: "no response from server"});
				}
				const { data } = err;
				console.log(data);
				this.setState({ errorText: data.message } );
			});
	}

	componentWillMount() {
		// Grab the log file
		console.log(this.props);
		const { app } = this.props;
		// No 'Version' has been submitted
		if (!app.appversionDetails) {
			console.log("FAILED", app);
			return ;
		}
		const { appname } = app;
		const { version } = app.appversionDetails;
		const logFilePath = `${appname}__${version}`;

		axios.get(`${APP_REQUEST_SERVICE}/apprequest/logfile/${logFilePath}`)
			.then(response => {
				console.log("LOG FILE GETTED")
				const { data } = response;
				console.log(data);
				this.setState({ logFile: data, errorText: ''});
				console.log("LOG FILE GOT")
			})
			.catch(err => {
				console.log("FAILURE", err);
				if (!err.response) {
					return this.setState({ errorText: "no response from server" });
				}
				const { data } = err;
				this.setState({ errorText: data.message });
			});
	}

	render() {
		const { errorText, logFile } = this.state;
		const { show, toggle, app } = this.props;
		if (!app.appversionDetails) {
			console.log("wont open");
			return null;
		}

		const { id } = app.appversionDetails;

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
							onClick={() => this.launchApp(id)}
						>
							Launch App!
						</ButtonMakiti>
					</div>
				</Modal>
			</div>
		);
	}
}

export default LaunchAppModal;
