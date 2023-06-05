import { Table } from "components";
import { getHistoryTableProcessedData } from ".";
import { HistoryCard } from "..";

/**
 * A <HistoryTable> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<HistoryTable></HistoryTable>` TODO: Fix example
 */
const HistoryTable = ({
	pageNumber,
	setPageNumber,
	tablePageLimit,
	transactionList,
}) => {
	const processedData = getHistoryTableProcessedData(transactionList);
	const tableDataListLength = processedData?.length;
	console.log("tableDataListLength", tableDataListLength);
	const renderer = [
		{
			name: "trx_name",
			field: "Transaction Type",
			sorting: true,
			show: "Avatar",
		},
		{
			name: "description",
			field: "Description",
			show: "Description",
		},
		{ name: "trx_id", field: "Transaction ID", sorting: true },
		{
			name: "amount",
			field: "Amount",
			sorting: true,
			show: "Payment",
		},
		{
			name: "dateTime",
			field: "Date & Time",
			sorting: true,
			show: "DateView",
		},
		{
			name: "status",
			show: "Tag",
		},
		{ name: "customerMobile", field: "Customer Mobile" },
		{ name: "balance", field: "Balance Amount", show: "Amount" },
		{ name: "commissionEarned", field: "Commission Earned" },
		{ name: "Fee", field: "fee" },
		{ name: "TID", field: "tid" },
		{ name: "trackingNumber", field: "Tracking Number" },
	];

	return (
		<>
			<Table
				renderer={renderer}
				visibleColumns={6}
				data={processedData}
				variant="evenStripedExpandableRow"
				tableName="History"
				ResponsiveCard={HistoryCard}
				tableDataListLength={tableDataListLength}
				tablePageLimit={tablePageLimit}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
			/>
		</>
	);
};

export default HistoryTable;
