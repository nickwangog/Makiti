import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// Header image
import BannerImg from '../static/images/Makiti_Banner_LargerFont.png';

const HeaderLink = ({ children, ...props }) => (
	<NavLink
		exact
		className="p1 mx2 black text-decoration-none rounded"
		activeClassName="bg-blue"
		{...props}
	>
		{children}
	</NavLink>
);

const Header = () => (
	<header className="flex items-center justify-between">
		<img
			className="banner-image"
			src={BannerImg}
			alt="BannerImg"
		/>
		<HeaderLink to="/">Home</HeaderLink>
		<HeaderLink to="/Client">Clients</HeaderLink>
		<HeaderLink to="/Developer">Developers</HeaderLink>
		<HeaderLink to="/Admin">Admin</HeaderLink>
	</header>
);

HeaderLink.propTypes = {
	children: PropTypes.node,
};

export default Header;
