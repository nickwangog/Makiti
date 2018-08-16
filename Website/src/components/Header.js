import React from 'react';
import BannerImg from '../static/images/Makiti_Banner_LargerFont.png'

class Header extends React.Component {
	render() {
		return (
			<header>
				<img style={{height: 200 }} src={BannerImg}/>
			</header>
		);
	}
}

export default Header