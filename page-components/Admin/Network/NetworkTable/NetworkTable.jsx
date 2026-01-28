import { Flex, Text } from "@chakra-ui/react";
import { Table } from "components";
import { UserType } from "constants";
import { useOrgDetailContext, useSession } from "contexts";
import { useUserTypes } from "hooks";
import { useRouter } from "next/router";
import { NetworkCard } from "..";

const commission_types = {
	1: "Monthly",
	2: "Daily",
};

/**
 * Returns the commission type based on the provided value
 * @param {string | number | undefined} commission_type - The commission type value (1=Monthly, 2=Daily)
 * @returns {string} - The corresponding commission type label
 */
const getCommissionType = (commission_type) => {
	if (commission_type === undefined) return "Instant";
	return commission_types[commission_type];
};

/**
 * Custom hook to generate column configuration for the Network Table with dynamic labels and conditional columns.
 * Includes user-specific labels and conditional Employee ID column based on org settings.
 * @returns {Array<object>} - Array of column configuration objects with name, label, sorting, and visibility properties
 */
export const useNetworkTableParameterList = () => {
	const { getUserCodeLabel } = useUserTypes();
	const { userType } = useSession();
	const userCodeLabel = getUserCodeLabel(
		userType == UserType.FOS ? UserType.MERCHANT : 0
	);

	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail ?? {};
	const { login_meta } = metadata ?? {};
	const isMobileMappedUserId = login_meta?.mobile_mapped_user_id === 1;
	const userIdLabel = login_meta?.user_id_label ?? "User ID";

	const baseList = [
		{ label: "#", show: "#", visible_in_table: true },
		{
			name: "agent_name",
			label: "Name",
			show: "Avatar",
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
			name: "agent_mobile",
			label: "Mobile",
			show: "Mobile",
			sorting: true,
			visible_in_table: true,
		},
		{
			name: "onboarded_on",
			label: "Onboarded\nOn",
			sorting: true,
			show: "Date",
			visible_in_table: true,
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
			label: userCodeLabel,
			sorting: true,
			visible_in_table: true,
			hide_by_default: true,
		},
		{
			name: "agent_balance",
			label: "Agent\nBalance",
			show: "Amount",
			sorting: true,
			visible_in_table: true,
			hide_by_default: true,
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
			label: "Address",
			sorting: true,
			show: "Address",
			visible_in_table: true,
			hide_by_default: true,
		},
		{
			name: "active_location",
			label: "Location",
			sorting: true,
			show: "Location",
			visible_in_table: true,
			hide_by_default: true,
		},
		{
			name: "onboarding_location",
			label: "Onboarding\nLocation",
			sorting: true,
			show: "Location",
			visible_in_table: true,
			hide_by_default: true,
		},
		{ name: "", label: "", show: "Modal", visible_in_table: true },
		{ name: "", label: "", show: "Arrow", visible_in_table: true },
	];

	// Conditionally add Employee ID column if orgDetail.user_id exists
	if (isMobileMappedUserId) {
		baseList.splice(7, 0, {
			name: "user_id",
			label: userIdLabel,
			sorting: true,
			visible_in_table: true,
			hide_by_default: true,
		});
	}

	return baseList;
};

/**
 * NetworkTable page-component that displays agent network data in a table or card layout.
 * Redirects to agent profile on row click. Supports pagination, column visibility, and status updates.
 * @param {object} props - Component properties
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {number} props.pageNumber - Current page number for pagination
 * @param {number} props.totalRecords - Total number of agent records
 * @param {Array<object>} props.agentDetails - Array of agent data objects
 * @param {Function} props.setPageNumber - Callback to update current page number
 * @param {Array<object>} [props.visibleColumns] - Optional array of visible column configurations
 * @param {Function} [props.onStatusUpdate] - Optional callback triggered on agent status update
 * @returns {JSX.Element} - Rendered NetworkTable component or empty state
 */
const NetworkTable = ({
	isLoading,
	pageNumber,
	totalRecords,
	agentDetails,
	setPageNumber,
	visibleColumns,
	onStatusUpdate,
}) => {
	const { isAdmin } = useSession();
	const router = useRouter();

	agentDetails?.forEach((agent) => {
		const commission_type = agent?.commission_duration;
		const agent_balance = agent?.profile?.wallet_balance || 0;
		agent.commission_type = getCommissionType(commission_type);
		agent.agent_balance = agent_balance;
		agent._onStatusUpdate = onStatusUpdate;
	});

	const networkTableDataSize = agentDetails?.length ?? 0;

	// Use visible columns if provided, otherwise use dynamically generated list
	const defaultColumns = useNetworkTableParameterList();
	const columnsToRender = visibleColumns || defaultColumns;

	/**
	 * Table row click handler that navigates to agent profile page
	 * @param {object} rowData - Agent data object from table row
	 * @param {string} rowData.agent_mobile - Agent mobile number used for routing
	 * @returns {void}
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
