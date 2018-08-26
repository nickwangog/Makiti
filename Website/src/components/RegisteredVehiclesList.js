import React from 'react';
import axios from 'axios';

const VehicleItem = (props) => {
	return (
		<div className="registered-car-list" onClick={props.onClick}>
			<div className="underline registered-car-item h5">
			{props.vehicle.carDetails.carmodelDetails.year} {props.vehicle.carDetails.carmodelDetails.model}
			</div>
			<div className="registered-car-item h6">
			Type: {props.vehicle.carDetails.carmodelDetails.cartype}
			</div>
			<div className="registered-car-item h6">
			{props.vehicle.carDetails.carmodelDetails.description}
			</div>
		</div>
	)
}


class RegisteredVehiclesList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			vehicleList: [],
		};
	}

	getList = (customerId) => {
		axios.get(`${CAR_REGISTRATION_SERVICE}/carregistration/customer/${customerId}`)
			.then(response => {
				console.log("SUCCESS", response);
				const { data } = response.data;
				this.setState({ vehicleList: data });
			})
			.catch(err => {
				console.log("ERR", err);
			});
	}

	componentWillMount() {
		const { id } = this.props.appState.accountDetails;
		this.getList(id);
	}

	render() {
		const { vehicleList } = this.state;
		const { onClick } = this.props;

		return (
			<ul>
				{vehicleList.map((v) => (
					<div key={v.id}>
						<VehicleItem vehicle={v} onClick={() => onClick(v)}/>
					</div>
				))}
			</ul>
		);
	}
}

export default RegisteredVehiclesList;
