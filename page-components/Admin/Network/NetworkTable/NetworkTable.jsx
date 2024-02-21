import { Flex, Text } from "@chakra-ui/react";
import { Button, Table } from "components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
 * Network table parameter list
 */
const networkTableParameterList = [
	{ label: "Sr. No.", show: "#" },
	{ name: "agent_name", label: "Name", show: "Avatar", sorting: true },
	{ name: "agent_mobile", label: "Mobile", sorting: true },
	{ name: "agent_type", label: "Type", sorting: true },
	{
		name: "onboarded_on",
		label: "Onboarded\nOn",
		sorting: true,
		show: "Date",
	},
	{
		name: "account_status",
		label: "Account\nStatus",
		sorting: true,
		show: "Tag",
	},
	{ name: "eko_code", label: "User Code", sorting: true },
	{
		name: "commission_type",
		label: "Commission\nFrequency",
		sorting: true,
	},
	{
		name: "location",
		label: "Location",
		sorting: true,
		show: "IconButton",
	},
	{ name: "", label: "", show: "Modal" },
	{ name: "", label: "", show: "Arrow" },
];

/**
 * A NetworkTable page-component which will redirect to Retailer details on row click
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkTable></NetworkTable>`
 */
const NetworkTable = ({
	isLoading,
	pageNumber,
	totalRecords,
	agentDetails,
	setPageNumber,
}) => {
	const router = useRouter();
	const [lastPageWithData, setLastPageWithData] = useState(1);

	agentDetails?.forEach((agent) => {
		const commission_type = agent?.commission_duration;
		agent.commission_type = getCommissionType(commission_type);
	});

	const networkTableDataSize = agentDetails?.length ?? 0;

	/**
	 * Table row click handler
	 * @param {*} rowData
	 */
	const onRowClick = (rowData) => {
		const mobile = rowData?.agent_mobile;
		localStorage.setItem(
			"oth_last_selected_agent",
			JSON.stringify(rowData)
		);
		router.push({
			pathname: `/admin/my-network/profile`,
			query: { mobile },
		});
	};

	useEffect(() => {
		if (networkTableDataSize > 0) setLastPageWithData(pageNumber);
	}, [agentDetails]);

	let _pathname = router.pathname;

	if (!isLoading && networkTableDataSize < 1) {
		return (
			<Flex direction="column" align="center" gap="2">
				<Text color="light">Nothing Found</Text>
				<Button
					onClick={() => {
						router.push({
							pathname: _pathname,
							query: { page: lastPageWithData },
						});
						setPageNumber(lastPageWithData);
					}}
				>
					Back
				</Button>
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
				renderer: networkTableParameterList,
			}}
		/>
	);
};

export default NetworkTable;
