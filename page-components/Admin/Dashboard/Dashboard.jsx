import { Headings } from "components/Headings";
import { BusinessDashboard } from "./BusinessDashboard";

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
			<Headings
				title="Business Dashboard"
				hasIcon={false}
				isMTRequired={false}
			/>
			<BusinessDashboard />
		</div>
	);
};

export default Dashboard;
