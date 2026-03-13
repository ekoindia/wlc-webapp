import { Share, Table } from "components";
import { UserType } from "constants/UserTypes";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { getNameStyle } from "helpers";

const onboardRetailerRenderer = [
	{ label: "Sr. No.", show: "#" },
	{
		name: "name",
		label: "Name",
		sorting: true,
		render: (row) => getNameStyle(row.name),
	},
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
	{
		name: "name",
		label: "Name",
		sorting: true,
		render: (row) => getNameStyle(row.name),
	},
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
 * Displays the results of agent onboarding operations in a tabular format
 * @param {object} prop - Properties passed to the component
 * @param {string} prop.applicantType - The type of agent being onboarded (e.g., MERCHANT or DISTRIBUTOR)
 * @param {Array} prop.responseList - List of onboarding responses from the API, containing status and details
 * @returns {JSX.Element} A table showing the onboarding results with status indicators
 * @example
 * ```jsx
 * <OnboardAgentResponse applicantType={UserType.MERCHANT} responseList={apiResponseData.csp_list} />
 * ```
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
				render: (row) => (
					<Share
						mobile={row.mobile}
						url={window.location.origin || ""}
						text={`Welcome to ${orgDetail?.org_name}!\n\nClick on the link to login to the ${orgDetail?.app_name} app:`}
						size="xs"
					/>
				),
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
