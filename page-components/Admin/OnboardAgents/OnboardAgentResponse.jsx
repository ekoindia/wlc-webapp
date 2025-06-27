import { Table } from "components";
import { UserType } from "constants/UserTypes";
import { useOrgDetailContext } from "contexts/OrgDetailContext";

const onboardRetailerRenderer = [
	{ label: "Sr. No.", show: "#" },
	{ name: "name", label: "Name", sorting: true, show: "Avatar" },
	{ name: "mobile", label: "Mobile", sorting: true },
	// { name: "dist_mobile", label: "Distributor Mobile Number", sorting: true },
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
	{ name: "mobile", label: "Mobile", sorting: true },
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
 * A OnboardAgentResponse page-component, to show result after user uploaded list of users to be onboarded on platform
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.applicantType
 * @param prop.responseList
 * @example	`<OnboardAgentResponse></OnboardAgentResponse>`
 */
const OnboardAgentResponse = ({ applicantType, responseList }) => {
	const { orgDetail } = useOrgDetailContext();

	const tableRenderer = [
		...(applicantType == UserType.MERCHANT
			? onboardRetailerRenderer
			: onboardDistributorRenderer),
		// Add share link for the current app/website
		...[
			{
				name: "mobile",
				label: "Share Login Link",
				show: "ShareMobile",
				meta: {
					text: `Welcome to ${orgDetail?.org_name}!\n\nClick on the link to login to the ${orgDetail?.app_name} app:`,
					url: window.location.origin || "",
				},
			},
		],
	];

	return (
		<Table
			variant="stripedActionNone"
			renderer={tableRenderer}
			data={responseList}
		/>
	);
};

export default OnboardAgentResponse;
