import { Table } from "components";
import { tableVariant } from "constants";
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
	tableRowLimit,
	transactionList,
}) => {
	const processedData = getHistoryTableProcessedData(transactionList);
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
		{
			name: "commissionEarned",
			field: "Commission Earned",
			show: "Amount",
		},
		{ name: "fee", field: "Fee", show: "Amount" },
		{ name: "tid", field: "TID" },
		{ name: "trackingNumber", field: "Tracking Number" },
	];

	return (
		<>
			<Table
				renderer={renderer}
				visibleColumns={6}
				data={processedData}
				variant={tableVariant?.EXPAND}
				tableName="History"
				ResponsiveCard={HistoryCard}
				tableRowLimit={tableRowLimit}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
			/>
		</>
	);
};

export default HistoryTable;
