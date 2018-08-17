import axios from 'axios';
import React from 'react';
import AppList from './AppList';
import AppDetail from './AppDetail';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			apps: [],
			currentApp: null,
		};
	}

	componentDidMount() {
		axios.get(`${API_URL}/v1/recipes`) // API call will go here
			.then(response => response.data)
			.then((apps) => {
				// Manually adding apps here, however this will be different
				// -------------- delete in future
				apps = [
					{ id: 1, name: 'ProApp', description: 'A pretty Pro App' },
					{ id: 2, name: 'AverageApp', description: 'A pretty Average App' },
					{ id: 3, name: 'Some App', description: 'Orders milk for you every 6 hours' },
				];
				// -------------- delete in future
				this.setState({ apps });
				// console.log(this.state);
			})
			.catch(error => console.log(error));
	}

	onAppListClick = (id) => {
		axios.get(`${API_URL}/v1/recipes/${id}`) // API call will go here
			.then(response => response.data)
			.then((currentApp) => {
				// Manually adding app information here, however this will be different
				// -------------- delete in future
				currentApp = {
					name: Math.random() > 0.5 ? 'A neat App' : 'An app that wants all your money!',
					description: Math.random() > 0.5 ? 'A description will go here' : 'A FUN THING FOR ALL THE FAMILY',
					category: Math.random() > 0.5 ? 'fun' : 'not fun',
					price: Math.random() > 0.5 ? 'Free' : '$1,000,000',
					review: Math.random() > 0.5 ? 'pretty good' : 'pretty bad',
					rating: Math.floor(Math.random() * 10.0) % 6,
					image: Math.random() > 0.5 ? 'https://support.apple.com/library/content/dam/edam/applecare/images/en_US/mac_apps/itunes/ios11-app-store-3nav-icon.png' : 'https://lh3.googleusercontent.com/DKoidc0T3T1KvYC2stChcX9zwmjKj1pgmg3hXzGBDQXM8RG_7JjgiuS0CLOh8DUa7as=s180',
					howTo: ['open app', 'do stuff', 'enjoy'],
				};
				// -------------- delete in future
				this.setState({ currentApp });
				// console.log(this.state);
			})
			.catch(error => console.log(error));
	}

	render() {
		const { apps, currentApp } = this.state;

		return (
			<div>
				<main className="px2 flex">
					<AppList
						apps={apps}
						style={{ flex: 3 }}
						onClick={this.onAppListClick}
					/>
					<AppDetail
						app={currentApp}
						className="ml4 p2"
						style={{ flex: 5 }}
					/>
				</main>
			</div>
		);
	}
}

export default Home;
