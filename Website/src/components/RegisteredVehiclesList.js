import React from 'react';
import axios from 'axios';

import { car_registration_service } from './AxiosHandler';

const VehicleItem = (props) => {
	return (
		<div onClick={props.onClick}>
			{props.vehicle.carDetails.carmodelDetails.cartype}
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
			<ul className="p1 flex-column app-list-body">
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
