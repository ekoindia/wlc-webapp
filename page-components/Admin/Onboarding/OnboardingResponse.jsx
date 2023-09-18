import { Table } from "components";

const AGENT_TYPE = {
	RETAILER: "0",
	DISTRIBUTOR: "2",
};

const onboardRetailerRenderer = [
	{ label: "Sr. No.", show: "#" },
	{ name: "name", label: "Name", sorting: true, show: "Avatar" },
	{ name: "mobile", label: "Mobile Number", sorting: true },
	{ name: "dist_mobile", label: "Distributor Mobile Number", sorting: true },
	{
		name: "status",
		label: "Status",
		sorting: true,
		show: "Tag",
	},
	{
		name: "reason",
		label: "Reason",
		show: "Description",
	},
];

const onboardDistributorRenderer = [
	{ label: "Sr. No.", show: "#" },
	{ name: "name", label: "Name", sorting: true, show: "Avatar" },
	{ name: "mobile", label: "Mobile Number", sorting: true },
	{
		name: "status",
		label: "Status",
		sorting: true,
		show: "Tag",
	},
	{
		name: "reason",
		label: "Reason",
		show: "Description",
	},
];

/**
 * A OnboardingResponse page-component, to show result after user uploaded list of users to be onboarded on platform
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingResponse></OnboardingResponse>`
 */
const OnboardingResponse = ({ agentType, responseList }) => {
	return (
		<Table
			variant="stripedActionNone"
			renderer={
				agentType === AGENT_TYPE.RETAILER
					? onboardRetailerRenderer
					: onboardDistributorRenderer
			}
			data={responseList}
		/>
	);
};

export default OnboardingResponse;
