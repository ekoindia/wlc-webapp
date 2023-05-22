import { Table } from "components";
import { useRouter } from "next/router";
import { NetworkCard } from "..";
/**
 * A <NetworkTable> component
 * TODO: This is my network table with clickable rows
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
		{ name: "", field: "Sr. No." },
		{ name: "agent_name", field: "Name", sorting: true, show: "Avatar" },
		{ name: "agent_mobile", field: "Mobile Number", sorting: true },
		{ name: "agent_type", field: "Type", sorting: true },
		{ name: "onboarded_on", field: "Onboarded On", sorting: true },
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
		const cellnumber = rowData.agent_mobile;
		localStorage.setItem("rowData", JSON.stringify(rowData));
		router.push({
			pathname: `/admin/my-network/profile`,
			query: { cellnumber },
			// state: { rowData },
		});
	};

	return (
		<>
			<Table
				onRowClick={onRowClick}
				pageLimit="10"
				renderer={renderer}
				variant="evenStripedClickableRow"
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
