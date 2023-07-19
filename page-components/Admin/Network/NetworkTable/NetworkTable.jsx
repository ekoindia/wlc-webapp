import { Table } from "components";
import { useRouter } from "next/router";
import { NetworkCard } from "..";

/**
 * A NetworkTable page-component
 * TODO: This is my network table which will redirect to Retailer details on row click
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkTable></NetworkTable>`
 */
const NetworkTable = ({
	pageNumber,
	setPageNumber,
	totalRecords,
	agentDetails,
}) => {
	const renderer = [
		{ field: "Sr. No.", show: "#" },
		{ name: "agent_name", field: "Name", sorting: true, show: "Avatar" },
		{ name: "agent_mobile", field: "Mobile Number", sorting: true },
		{ name: "agent_type", field: "Type", sorting: true },
		{
			name: "onboarded_on",
			field: "Onboarded On",
			sorting: true,
			show: "Date",
		},
		{
			name: "account_status",
			field: "Account Status",
			sorting: true,
			show: "Tag",
		},
		{ name: "eko_code", field: "User Code", sorting: true },
		{
			name: "location",
			field: "Location",
			sorting: true,
			show: "IconButton",
		},
		{ name: "", field: "", show: "Modal" },
		{ name: "", field: "", show: "Arrow" },
	];
	const router = useRouter();
	const onRowClick = (rowData) => {
		const mobile = rowData?.agent_mobile;
		localStorage.setItem("network_seller_details", JSON.stringify(rowData));
		router.push({
			pathname: `/admin/my-network/profile`,
			query: { mobile },
			// state: { rowData },
		});
	};

	return (
		<>
			<Table
				onRowClick={onRowClick}
				renderer={renderer}
				variant="stripedActionRedirect"
				tableName="Network"
				totalRecords={totalRecords}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
				data={agentDetails}
				ResponsiveCard={NetworkCard}
			/>
		</>
	);
};

export default NetworkTable;
