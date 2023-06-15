import { Table } from "components";

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
	// totalRecords,
	data,
}) => {
	const renderer = [
		{ name: "ticketNumber", field: "Ticket ID" },
		{ name: "subject", field: "Subject", show: "Description" },
		{ name: "statusType", field: "Status", show: "Tag" },
		{ name: "contactName", field: "Agent Name" },
		{
			name: "eko_code",
			field: "Agent Code",
		},
		{
			name: "createdTime",
			field: "Time Created",
			sorting: true,
			show: "DateTime",
		},
		{
			name: "modifiedTime",
			field: "Last Updated",
			sorting: true,
			show: "DateTime",
		},
	];

	return (
		<Table
			renderer={renderer}
			variant="stripedActionNone"
			tableName="Query"
			// totalRecords={totalRecords}
			setPageNumber={setPageNumber}
			pageNumber={pageNumber}
			data={data}
		/>
	);
};

export default QueryCenterTable;
