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
			<div className="modal-background flex">
				<div className="modal-window">
					{this.props.children}
					<div className="footer">
						<button
							onClick={this.props.onClose}
							className="button-makiti"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Modal;