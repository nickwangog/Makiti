import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
import qs from 'qs';
import { sha256 } from 'js-sha256';

import ButtonMakiti from './ButtonMakiti';
import InputMakiti from './InputMakiti';
import Modal from './Modal';

class DeveloperNewAppButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			errorText: '',
			
			file: null,
			fileErr: '',
			
			icon: null,
			iconErr: '',

			appName: '',
			appNameErr: '',
			
			versionNumber: '',
			versionNumberErr: '',
			
			appDescription: '',
			appDescriptionErr: '',
			
			programmingLanguage: '',
			programmingLanguageErr: '',
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value,
						[`${e.target.name}Err`]: ''});
	}

	onLanguageSelect = (e) =>{
		this.setState({ programmingLanguage: e.target.getAttribute('value'),
						programmingLanguageErr: ''});
	}

	onFileChange = (e) => {
		this.setState({ file: e.target.files[0]});
	}

	onIconChange = (e) => {
		this.setState({ icon: e.target.files[0]});
	}


	toggleModal = () => {
		this.setState(() => ({ showModal: !this.state.showModal }));
	}

	setErrorText = (text) => {
		this.setState(() => ({ errorText: text }));
	}

	submitApp = (e) => {
		e.preventDefault();

		// Validate Form and submit application
		this.validateFormData(() => {
			const { file, icon, appName, versionNumber, appDescription, programmingLanguage } = this.state;
			let { id } = this.props.appState.accountDetails;

			// Request for a new App
			console.log("Making request for new App");
			axios.post(`${APPLICATION_SERVICE}/application/`, {
					'accountId': id,
					'appName': appName,
					'appDescription': appDescription,
					'programmingLanguage': programmingLanguage,
				})
				.then(response => {
					// Successful creation of a new App
					console.log("Successful creation of new App", response);
					const { data } = response.data;
					const config = {
							headers: {
								'content-type': 'multipart/form-data'
							},
						}
					const appId = data.id;
					let	formData = new FormData();
					let reader = new FileReader();

					// On successful load of file
					reader.onload = (event) => {
						let checksum = sha256(event.target.result);
						// Append to form data
						formData.append('file', file);
						formData.append('versionNumber', versionNumber);
						formData.append('versionDescription', "Check out our new App!");
						formData.append('checksum', checksum);
						formData.append('appName', appName);

						// Send request for first version of new app using the App ID received as response
						console.log("Requesting new app version");
						axios.post(`${APPLICATION_SERVICE}/application/version/${appId}`, formData, config)
							.then(response => {
								// Successful creation of first app version
								console.log("Successfully created new App version", response);
								const { data } = response.data;
								console.log("Requesting app review");
								axios.post(`${APP_REQUEST_SERVICE}/apprequest/developer`, {
										accountId: id, // account id
										appversionId: data.id, // Version id
										requestType: 1, // 1 is create app, 2 is update app
									})
									.then(response => {
										console.log("app review SUCCESS");
										this.toggleModal();
										this.props.refreshDeveloper();
									})
									.catch(err => {
										console.log("app review FAILURE");
										if (!err.response) {
											return this.setErrorText("Application Service is offline at the moment")
										}
										const { data } = err.response
										this.setErrorText(data.message);
									});
							})
							.catch(err => {
								// Error in creation of first app version
								console.log("Failure in creating new App version", err);
								if (!err.response) {
									return this.setErrorText("Application Service is offline at the moment")
								}
								const { data } = err.response
								this.setErrorText(data.message);
							});
					}
					reader.readAsArrayBuffer(file);
				})
				.catch(err => {
					console.log("Failure in creating new App", err);
					if (!err.response) {
						return this.setErrorText("Application Service is offline at the moment")
					}
					const { data } = err.response
					this.setErrorText(data.message);
				});
		});
	}

	validateFormData = (onSuccess) => {
		const { file, icon, appName, versionNumber, appDescription, programmingLanguage } = this.state;

		// Successful validation
		if (file &&
			icon &&
			appName.length &&
			versionNumber.length &&
			appDescription.length &&
			programmingLanguage.length) {
			this.setState(() => ({
				errorText: '',
				fileErr: '',
				iconErr: '',
				appNameErr: '',
				versionNumberErr: '',
				appDescriptionErr: '',
				programmingLanguageErr: '',
			}), onSuccess());
			return ;
		}

		// Validation Failure
		this.setState(() => ({
			fileErr: !file ? "required" : '',
			iconErr: !icon ? "required" : '',
			appNameErr: !appName.length ? "required" : '',
			versionNumberErr: !versionNumber.length ? "required" : '',
			appDescriptionErr: !appDescription.length ? "required" : '',
			programmingLanguageErr: !programmingLanguage.length ? "required" : '',
			errorText: '',
		}));

	}

	render() {
		const {	showModal,
				errorText,
				appName, appNameErr,
				file, fileErr,
				icon, iconErr,
				versionNumber, versionNumberErr,
				appDescription, appDescriptionErr,
				programmingLanguage, programmingLanguageErr } = this.state;

		return (
			<div className="center">
				<ButtonMakiti onClick={this.toggleModal}>
					Create New App ➕
				</ButtonMakiti>
				<Modal
					show={showModal}
					onClose={this.toggleModal}
					style={{width: 300}}
				>
					<div>
						<p className="text-error-red">{errorText}</p>
						<InputMakiti
							autoFocus
							show={true}
							name="appName"
							fieldname="Application Name"
							errors={appNameErr}
							value={appName}
							onChange={this.onChange}
						/>
						<div>
							<span className="text-error-red">{fileErr}</span>
							<h5 className="h5">Add your Zip File</h5>
							<input className="h5 white" type="file" onChange={this.onFileChange}/>
						</div>
						<div>
							<span className="text-error-red">{iconErr}</span>
							<h5 className="h5">Add an app Icon</h5>
							<input className="h5 white" type="file" onChange={this.onIconChange}/>
						</div>
						<div>
							<span className="text-error-red">{appDescriptionErr}</span>
							<h5 className="h5">Application Description</h5>
							<textarea
								name="text"
								rows="14"
								cols="20"
								wrap="soft"
								name="appDescription"
								style={{ height: 200, width: 200 }}
								value={appDescription}
								onChange={this.onChange}
							/>
						</div>
						<InputMakiti
							show={true}
							name="versionNumber"
							fieldname="Version Number"
							errors={versionNumberErr}
							value={versionNumber}
							onChange={this.onChange}
						/>
						<div className="dropdown-makiti">
							<h5 className="h5">
								Select Programming Language: {programmingLanguage}
								<span className="text-error-red">{programmingLanguageErr}</span>
							</h5>
							<div className="dropdown-content-makiti pointer">
								{['Python'].map(language => (
									<h6 key={language} className="h6 pointer" onClick={this.onLanguageSelect} value={language}>
										{language}
									</h6>
								))}
							</div>
						</div>
						<ButtonMakiti className="text-bold-black bg-green" onClick={this.submitApp}>
							Submit your Application!
						</ButtonMakiti>
					</div>
				</Modal>
			</div>
		);
	}
}

export default DeveloperNewAppButton;