import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AppListItem from './AppListItem';
import { RemoveAppButton, InstallAppButton }  from './AppButtons'

// The list of apps can be sent through props
class AppList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { appList, title, className, onClick, style } = this.props;

		return (
			<div className={classNames(className)} style={style}>
				<ul className="p1 flex-column app-list-body">
					{appList.map((app) => (
						<div key={app.id} onClick={() => (onClick(app.id))}>
							<AppListItem app={app} />
						</div>
					))}
				</ul>
			</div>
		);
	}
}

// Defining the prop types for the component for clarity purposes
AppList.propTypes = {
	className: PropTypes.string,
	appList: PropTypes.array,
	title: PropTypes.string,
};

export default AppList;
