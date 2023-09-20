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
		{ name: "ticketNumber", label: "Ticket ID" },
		{ name: "subject", label: "Subject", show: "Description" },
		{ name: "statusType", label: "Status", show: "Tag" },
		{ name: "contactName", label: "Agent Name" },
		// {
		// 	name: "eko_code",
		// 	label: "Agent Code",
		// },
		{
			name: "createdTime",
			label: "Time Created",
			sorting: true,
			show: "DateTime",
		},
		{
			name: "modifiedTime",
			label: "Last Updated",
			sorting: true,
			show: "DateTime",
		},
	];

	return (
		<Table
			renderer={renderer}
			// totalRecords={totalRecords}
			setPageNumber={setPageNumber}
			pageNumber={pageNumber}
			data={data}
		/>
	);
};

export default QueryCenterTable;
