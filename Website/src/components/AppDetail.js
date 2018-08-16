import React from 'react';
// import AppIcon from '../static/images/appicon.png';

// Controls the Right-Hand side Detail view of an App from the Database

class AppDetail extends React.Component {
	render() {
		// Handle zero-state
		if (!this.props.app) {
			return (
				<p	style={this.props.style}
					className="h3 p2 bg-white italic center"
				>
					Please select an App to see the Details
				</p>
		)}

		// Handle regular state
		return (
			<div style={this.props.style}>
				<h2>{this.props.app.name}</h2>
				<img src={this.props.app.image}/>
				<div>
					<span>{this.props.app.description}</span>
					<span>{this.props.app.category}</span>
				</div>
				<h3>Application Details</h3>
				<h4>Rating: {this.props.app.rating}/5</h4>
				<ul>
					{this.props.app.howTo.map(how => (
						<li key={how}> {how} </li>
					))}
				</ul>
				<h3>Installation</h3>
				<ol>
					<li>Press Install</li>
					<li>Profit!</li>
				</ol>
			</div>
		);
	}
}

export default AppDetail