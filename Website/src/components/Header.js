import React from 'react';
import BannerImg from '../static/images/Makiti_Banner_LargerFont.png'

class Header extends React.Component {
	render() {
		return (
			<header>
				<img style={{height: 200 }} src={BannerImg}/>
				<h1 className="h1">Apps that will be in the App Store, Yippee!</h1>
			</header>
		);
	}
}

export default Header