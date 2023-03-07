import React, { useEffect, useState } from "react";

/**
 * A <BusinessDashboard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BusinessDashboard></BusinessDashboard>`
 */
const BusinessDashboard = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<div className={`${className}`} {...props}>
			BusinessDashboard
		</div>
	);
};

export default BusinessDashboard;
