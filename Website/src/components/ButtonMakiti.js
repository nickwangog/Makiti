import React from 'react';
import classNames from 'classnames';

const ButtonMakiti = ({children, ...props }) => {
	const { onClick, className, style } = { ...props };
	
	return (
		<button
			type="button"
			className={classNames('button-makiti', className)}
			style={style}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export default ButtonMakiti;
