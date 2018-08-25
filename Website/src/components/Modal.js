import React from 'react';

class Modal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (!this.props.show) {
			return null;
		}

		return (
			<div className="modal-background">
				<div className="modal-window" style={this.props.style}>
					<div className="modal-header">
						<button onClick={this.props.onClose} className="button-makiti text-bold-black">
							X
						</button>
					</div>
					<div>
						{React.cloneElement(this.props.children, ...this.props )}
					</div>
				</div>
			</div>
		);
	}
}

export default Modal;
