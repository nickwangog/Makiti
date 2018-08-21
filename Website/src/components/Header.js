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
		this.props.authFunc.deAuthClient();
		this.props.authFunc.deAuthDev();
		this.props.authFunc.deAuthAdmin();
	}

	render() {
		const { show, authFunc } = this.props;

		if (show) {
			return (
				<button
					type="button"
					className="button-makiti"
					onClick={this.logOut}
				>
					Log out!
				</button>
			);
		}

		return null;
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
		this.setState(() => (
			{ loginModalIsOpen: !this.state.loginModalIsOpen }
		));
	}

	render() {
		const { isClient: isC, isDeveloper: isD, isAdmin: isA, authFunc } = this.props;

		return (
			<header className="justify-center">
				<div className="center bg-black">
					<img
						className="banner-image"
						src={BannerImg}
						alt="BannerImg"
					/>
				</div>
				<div className="flex justify-around py1 bg-mediumgray">
					<LogInModalButton show={!(isC || isD || isA)} toggleLoginModal={this.toggleLoginModal} />
					<Modal
						show={this.state.loginModalIsOpen}
						onClose={this.toggleLoginModal}
						style={{ width: 300 }}
					>
						<LoginForm {...this.props} onSuccess={this.toggleLoginModal} />
					</Modal>
					<LogOutButton show={isC || isD || isA} authFunc={authFunc} />
					<HeaderLink
						to="/"
						show={isC || isD || isA}
					>
						Home
					</HeaderLink>
					<HeaderLink
						to="/Client"
						show={isC}
					>
						My Apps
					</HeaderLink>
					<HeaderLink
						to="/Developer"
						show={isD}
					>
						Developers
					</HeaderLink>
					<HeaderLink
						to="/Admin"
						show={isA}
					>
						Admin
					</HeaderLink>
				</div>
			</header>
		);
	}
}

HeaderLink.propTypes = {
	children: PropTypes.node,
};

export default Header;
