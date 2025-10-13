import { Flex, Text } from "@chakra-ui/react";
import { Table } from "components";
import { useSession } from "contexts";
import { useRouter } from "next/router";
import { NetworkCard } from "..";

const commission_types = {
	1: "Monthly",
	2: "Daily",
};

/**
 * Returns the commission type based on the provided value.
 * @param {string} commission_type - The commission type value.
 * @returns {string} The corresponding commission type.
 */
const getCommissionType = (commission_type) => {
	if (commission_type === undefined) return "Instant";
	return commission_types[commission_type];
};

/**
 * Network table parameter list with column visibility metadata
 */
export const networkTableParameterList = [
	{ label: "#", show: "#", visible_in_table: true },
	{
		name: "agent_name",
		label: "Name",
		show: "Avatar",
		sorting: true,
		visible_in_table: true,
	},
	{
		name: "agent_mobile",
		label: "Mobile",
		sorting: true,
		visible_in_table: true,
	},
	{
		name: "agent_type",
		label: "Type",
		sorting: true,
		visible_in_table: true,
	},
	{
		name: "onboarded_on",
		label: "Onboarded\nOn",
		sorting: true,
		show: "Date",
		visible_in_table: true,
		hide_by_default: false,
	},
	{
		name: "account_status",
		label: "Account\nStatus",
		sorting: true,
		show: "Tag",
		visible_in_table: true,
	},
	{
		name: "eko_code",
		label: "User Code",
		sorting: true,
		visible_in_table: true,
		hide_by_default: false,
	},
	{
		name: "commission_type",
		label: "Commission\nFrequency",
		sorting: true,
		visible_in_table: true,
		hide_by_default: true,
	},
	{
		name: "location",
		label: "Location",
		sorting: true,
		show: "IconButton",
		visible_in_table: true,
		hide_by_default: true,
	},
	{ name: "", label: "", show: "Modal", visible_in_table: true },
	{ name: "", label: "", show: "Arrow", visible_in_table: true },
];

/**
 * A NetworkTable page-component which will redirect to Retailer details on row click
 * @param {object} prop - Properties passed to the component
 * @param {boolean} prop.isLoading - Loading state
 * @param {number} prop.pageNumber - Current page number
 * @param {number} prop.totalRecords - Total number of records
 * @param {Array} prop.agentDetails - Array of agent data
 * @param {Function} prop.setPageNumber - Function to set page number
 * @param {Array} [prop.visibleColumns] - Optional array of visible columns
 * @returns {JSX.Element} The rendered NetworkTable component
 * @example	`<NetworkTable></NetworkTable>`
 */
const NetworkTable = ({
	isLoading,
	pageNumber,
	totalRecords,
	agentDetails,
	setPageNumber,
	visibleColumns,
}) => {
	const { isAdmin } = useSession();
	const router = useRouter();
	// const [lastPageWithData, setLastPageWithData] = useState(1);

	agentDetails?.forEach((agent) => {
		const commission_type = agent?.commission_duration;
		agent.commission_type = getCommissionType(commission_type);
	});

	const networkTableDataSize = agentDetails?.length ?? 0;

	// Use visible columns if provided, otherwise use full list
	const columnsToRender = visibleColumns || networkTableParameterList;

	/**
	 * Table row click handler
	 * @param {object} rowData - Row data object
	 */
	const onRowClick = (rowData) => {
		const mobile = rowData?.agent_mobile;
		localStorage.setItem(
			"oth_last_selected_agent",
			JSON.stringify(rowData)
		);

		let _pathname = isAdmin
			? `/admin/my-network/profile`
			: `/my-network/profile`;

		router.push({
			pathname: _pathname,
			query: { mobile },
		});
	};

	if (!isLoading && networkTableDataSize < 1) {
		return (
			<Flex direction="column" align="center" gap="2">
				<Text color="light">Nothing Found</Text>
			</Flex>
		);
	}

	return (
		<Table
			{...{
				isLoading,
				onRowClick,
				pageNumber,
				totalRecords,
				setPageNumber,
				data: agentDetails,
				ResponsiveCard: NetworkCard,
				variant: "stripedActionRedirect",
				renderer: columnsToRender,
			}}
		/>
	);
};

export default NetworkTable;
