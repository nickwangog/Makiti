import React from 'react';
import PropTypes from 'prop-types';

import AppListItem from './AppListItem';
import classNames from 'classnames';


// The list of apps can be sent through props
class AppList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { appList, title, className } = this.props;

		console.log("APP_LIST", appList);

		return (
			<div className={classNames(className)}>
				<ul className="p1 flex-column app-list-body">
					{appList.map(app => (
						<AppListItem app={app} key={app.id} />
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
