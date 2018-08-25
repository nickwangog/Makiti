import React from 'react';
import FordImg from '../static/images/Ford_Icon.png';

class Footer extends React.Component {
    constructor(props) {
		super(props);
    }
    
    render() {

		return (
                <img className="footer-image"
                    src={FordImg}
                    alt="FordImg"
                />
		);
	}
}

export default Footer;