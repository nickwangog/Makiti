import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
import qs from 'qs';
import { sha256 } from 'js-sha256';

import ButtonMakiti from './ButtonMakiti';
import InputMakiti from './InputMakiti';
import Modal from './Modal';

import { application_service, app_request_service } from './AxiosHandler';

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
			const { id, firstname } = this.props.appState.accountDetails;
			const { parentFuncs } = this.props;

			// Request for a new App
			application_service.post(`/application/`, {
					'accountId': id,
					'appName': appName,
					'appDescription': appDescription,
					'programmingLanguage': programmingLanguage,
					'author': firstname,
				})
				.then(data => {
					// Successful creation of a new App
					data = data.data;
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
						// formData.append('image', icon);
						formData.append('versionNumber', versionNumber);
						formData.append('versionDescription', "Check out our new App!");
						formData.append('checksum', checksum);
						formData.append('appName', appName);

						// Send request for first version of new app using the App ID received as response
						application_service.post(`/application/version/${appId}`, formData, config)
							.then(data => {
								data = data.data;
								// Creates a request to review the app.
								app_request_service.post('/apprequest/developer', {
										accountId: id, // account id
										appversionId: data.id, // Version id
										requestType: 1, // 1 is create app, 2 is update app
										appName: appName, // Application Name
										checksum: checksum,
										versionNumber: versionNumber,
									})
									.then(data => {
										this.toggleModal();
										parentFuncs.refreshDeveloper();
										parentFuncs.setSuccessText("You have successfully submitted an app for review");
									})
									.catch(err => {
										let error = err.data;
										error = error ? error.message : err;
										this.setErrorText(error);
										parentFuncs.setErrorText(error);
									});
							})
							.catch(err => {
								// Error in creation of first app version
								const error = err.data;
								this.setErrorText(error ? error.message : err);
							});
					}
					reader.readAsArrayBuffer(file);
				})
				.catch(err => {
					const error = err.data;
					this.setErrorText(error ? error.message : err);
				});
		});
	}

	validateFormData = (onSuccess) => {
		const { file, icon, appName, versionNumber, appDescription, programmingLanguage } = this.state;

		console.log(icon);

		// Successful validation
		if (file &&
			// icon &&
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
			// iconErr: !icon ? "required" : '',
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
						{
						//<div>
							//<span className="text-error-red">{iconErr}</span>
							//<h5 className="h5">Add an app Icon</h5>
							//<input className="h5 white" type="file" onChange={this.onIconChange}/>
						//</div>
						}
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