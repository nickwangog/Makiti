import React from 'react';

//	A helper element for both the username and password
const InputMakiti = ({
	...props
}) => {
	const { show, errors, fieldname, ...inputProps } = { ...props };

	if (!show) {
		return null;
	}

	return (
		<div>
			<span className="flex flex-wrap items-baseline">
				<h5 className="h5">{fieldname}</h5>
				<p className="text-error-red">{errors}</p>
			</span>
			<input
				className="login-input"
				{ ...inputProps }
			/>
		</div>
	);
}

export default InputMakiti;
