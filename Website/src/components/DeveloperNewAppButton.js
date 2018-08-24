import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
import qs from 'qs';

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

	toggleModal = () => {
		this.setState(() => ({ showModal: !this.state.showModal }));
	}

	submitApp = (e) => {
		e.preventDefault();

		// Validate Form and submit application
		this.validateFormData(() => {
			const { file, icon, appName, versionNumber, appDescription, programmingLanguage } = this.state;
			let { id } = this.props.appState.accountDetails;
			let formData = new FormData();
			let config = {
				headers: {
					'content-type': 'multipart/form-data'
				},
			};


			// Append data to send to server
			formData.append('file', file);
			formData.append('accountId', id);
			formData.append('appName', appName);
			formData.append('versionNumber', versionNumber);
			formData.append('appDescription', appDescription);
			formData.append('programmingLanguage', programmingLanguage);

			// Make request
			axios.post(`${APPLICATION_SERVICE}/application/`, formData, config)
				.then(response => {
					const { data } = response.data;
					console.log("SUCCESS", data);
				})
				.catch(err => {
					const { data } = err.response;
					console.log( "FAILURE", data );
					this.setState(() => ({ errorText: data.message }));
				});
		})
	}

	validateFormData = (onSuccess) => {
		const { file, icon, appName, versionNumber, appDescription, programmingLanguage } = this.state;

		// Successful validation
		if (appName.length && versionNumber.length && appDescription.length && programmingLanguage.length) {
			this.setState(() => ({
				errorText: '',
				appNameErr: '',
				versionNumberErr: '',
				appDescriptionErr: '',
				programmingLanguageErr: '',
			}), onSuccess());
			return ;
		}

		// Validation Failure
		this.setState(() => ({
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
						<form onSubmit={this.submitApp}>
							<input className="h5" type="file" onChange={this.onFileChange}/>
							<ButtonMakiti className="text-bold-black bg-green" onClick={this.submitApp}>
								Submit your Application!
							</ButtonMakiti>
						</form>
					</div>
				</Modal>
			</div>
		);
	}
}

export default DeveloperNewAppButton;