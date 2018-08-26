import React from 'react';
import axios from 'axios';

import { car_registration_service } from './AxiosHandler';

const VehicleItem = (props) => {
	return (
		<div className="registered-car-list pointer" onClick={props.onClick}>
			<div className="underline registered-car-item h5">
			{props.vehicle.carDetails.carmodelDetails.year} {props.vehicle.carDetails.carmodelDetails.model}
			</div>
			<div className="registered-car-item h6">
			Type: {props.vehicle.carDetails.carmodelDetails.cartype}
			</div>
			<div className="registered-car-item h6">
			{props.vehicle.carDetails.carmodelDetails.description}
			</div>
			<div className="car-divider"/>
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
		car_registration_service.get(`/carregistration/customer/${customerId}`)
			.then(data => {
				this.setState({ vehicleList: data.data });
			})
			.catch(err => {
				return ;
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
