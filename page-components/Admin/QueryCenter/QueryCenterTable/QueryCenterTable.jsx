import { Table } from "components";

/**
 * Show a list of queries raised by the admin/user.
 * @param 	{object}	prop	Properties passed to the component
 * @param 	{number}	prop.pageNumber	Current page number
 * @param 	{Function}	prop.setPageNumber	Function to set the page number
 * @param 	{object[]}	prop.data	List of queries
 * @param 	{Function}	prop.onSelect	Function to call when a ticket/query is selected. It should accept the data and the index of the selected ticket.
 */
const QueryCenterTable = ({
	// pageNumber,
	// setPageNumber,
	// totalRecords,
	data,
	onSelect,
}) => {
	const renderer = [
		{ name: "ticketNumber", label: "Ticket ID" },
		{ name: "label", label: "Subject", show: "Description" },
		{ name: "status", label: "Status", show: "Tag" },
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
		{ name: "", label: "", show: "Arrow" },
	];

	return (
		<Table
			renderer={renderer}
			// totalRecords={totalRecords}
			// setPageNumber={setPageNumber}
			// pageNumber={pageNumber}
			data={data}
			onRowClick={onSelect}
			// visibleColumns={5}
			variant="stripedActionRedirect"
		/>
	);
};

export default QueryCenterTable;
