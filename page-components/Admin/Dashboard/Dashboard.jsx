import React from "react";
import { BusinessDashboard } from "./BusinessDashboard";
import { OnboardingDashboard } from "./OnboardingDashboard";

/**
 * A <Dashboard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Dashboard></Dashboard>`
 */
const Dashboard = ({ className = "", ...props }) => {
	return (
		<div className={`${className}`} {...props}>
			<BusinessDashboard />
		</div>
	);
};

export default Dashboard;
