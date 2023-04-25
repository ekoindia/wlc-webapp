import { Table } from "components";
import { getTableProcessedData } from "helpers/processData";

/**
 * A <HistoryTable> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<HistoryTable></HistoryTable>` TODO: Fix example
 */
const HistoryTable = ({ transactionList }) => {
	const processedData = getTableProcessedData(transactionList);
	const renderer = [
		{ name: "", field: "", show: "Accordian" },
		{
			name: "trx_name",
			field: "Transaction Type",
			sorting: true,
			show: "Avatar",
		},
		{
			name: "description",
			field: "Description",
			// sorting: true,
		},
		{ name: "trx_id", field: "Transaction ID", sorting: true },
		{
			name: "amount",
			field: "Amount",
			show: "Amount",
			sorting: true,
		},
		{ name: "date", field: "Date", sorting: true },
		{ name: "time", field: "Time", sorting: true },
		{
			name: "status",
			show: "Tag",
		},
	];

	const rendererExpandedRow = [
		{ name: "balance", field: "Balance Amount", show: "Amount" },
		{ name: "trackingNumber", field: "Tracking Number" },
		{ name: "date", field: "Date" },
		{ name: "time", field: "Time" },
	];

	return (
		<>
			<Table
				// pageLimit={10}
				renderer={renderer}
				rendererExpandedRow={rendererExpandedRow}
				data={processedData}
				variant="darkStriped"
				tableName="Transactions"
				accordian={true}
				isPaginationRequired={false}
				isOnclickRequire={false}
			/>
		</>
	);
};

export default HistoryTable;
