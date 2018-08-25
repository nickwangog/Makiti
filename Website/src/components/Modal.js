import React from 'react';

class Modal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { show, style, onClose, children } = this.props;

		if (!show) {
			return null;
		}

		return (
			<div className="modal-background">
				<div className="modal-window" style={style}>
					<div className="modal-header">
						<button onClick={onClose} className="button-makiti text-bold-black">
							X
						</button>
					</div>
					<div>
						{React.cloneElement(children, ...this.props )}
					</div>
				</div>
			</div>
		);
	}
}

export default Modal;
