import { Table } from "components";
import { useRouter } from "next/router";

/**
 * A <QueryCenterTable> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<QueryCenterTable></QueryCenterTable>` TODO: Fix example
 */
const QueryCenterTable = ({
	pageNumber,
	setPageNumber,
	totalRecords,
	agentDetails,
}) => {
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

	const renderer = [
		{ name: "ticketNumber", field: "Ticket ID" },
		{ name: "subject", field: "Subject" },
		{ name: "statusType", field: "Status", show: "Tag" },
		{ name: "contactName", field: "Agent Name" },
		{
			name: "eko_code",
			field: "Agent Code",
		},
		{ name: "createdTime", field: "Time Created", sorting: true },
		{
			name: "modifiedTime",
			field: "Last Updated",
			sorting: true,
		},
	];

	return (
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
		/>
	);
};

export default QueryCenterTable;
