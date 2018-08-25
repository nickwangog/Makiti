import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// Header image
import BannerImg from '../static/images/Makiti_Banner_LargerFont.png';
import Modal from './Modal';
import LoginForm from './LoginForm';

const HeaderLink = ({
	children,
	show,
	...props,
}) => (
	show ?
		<NavLink
			exact
			className="button-makiti"
			activeClassName="bg-white"
			{...props}
		>
			{children}
		</NavLink>
		: null
);

const LogInModalButton = (props) => {

	if (!props.show) {
		return null;
	}

	return (
		<button
			type="button"
			className="button-makiti"
			onClick={props.toggleLoginModal}
		>
			Log in / Sign Up
		</button>
	);
}

class LogOutButton extends React.Component {
	constructor(props) {
		super(props);
	}

	logOut = (e) => {
		e.preventDefault();
		this.props.clearAccountDetails();
	}

	render() {
		const { show } = this.props;

		if (!show) {
			return null;
		}

		return (
			<button
				type="button"
				className="button-makiti"
				onClick={this.logOut}
			>
				Log out, {this.props.accountDetails.firstname}!
			</button>
		);
	}
}

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loginModalIsOpen: false,
		}
	}

	toggleLoginModal = () => {
		this.setState(() => ({ loginModalIsOpen: !this.state.loginModalIsOpen }));
	}

	render() {
		const { customer: isC, developer: isD, admin: isA, firstname } = this.props.accountDetails;

		return (
			<header className="justify-center">
				<div className="flex justify-center bg-black items-baseline">
					<img
						className="banner-image"
						src={BannerImg}
						alt="BannerImg"
					/>
					<h3 className="h3">{firstname ? `Hi, ${firstname}` : null}</h3>
				</div>
				<div className="flex flex-wrap justify-around bg-mediumgray">
					<LogInModalButton show={!(isC || isD || isA)} toggleLoginModal={this.toggleLoginModal} />
					<Modal
						show={this.state.loginModalIsOpen}
						onClose={this.toggleLoginModal}
						style={{ width: 300 }}
					>
						<LoginForm {...this.props} onSuccess={this.toggleLoginModal} />
					</Modal>
					<HeaderLink to="/" show={isC || isD || isA}>
						Home
					</HeaderLink>
					<HeaderLink to="/Client" show={isC}>
						My Apps
					</HeaderLink>
					<HeaderLink to="/Developer" show={isD}>
						Developers
					</HeaderLink>
					<HeaderLink to="/Admin" show={isA}>
						Admin
					</HeaderLink>
					<HeaderLink to="/AccountSettings" show={isC}>
						Account Settings
					</HeaderLink>
					<LogOutButton show={isC || isD || isA} {...this.props} />
				</div>
			</header>
		);
	}
}

HeaderLink.propTypes = {
	children: PropTypes.node,
};

export default Header;
