import { Table } from "components";
import { DisplayMedia } from "constants";
import { getHistoryTableProcessedData } from ".";
import { HistoryCard } from "..";

/**
 * Returns the default view component for a given parameter type id.
 * TODO: Remove "view" components in favor of <Value> component that directly uses the parameter-type-id. Allow custom value-renderer components to be passed to <Value> component (or, prefix/postfix components).
 * @param {number} parameter_type_id
 * @returns
 */
const getViewComponent = (parameter_type_id) => {
	switch (parameter_type_id) {
		case 9:
			return "Amount";
		case 12:
			return "Avatar";
		case 14:
			return "DateTime";
		case 15:
			return "Mobile";
		default:
			return null;
	}
};

/**
 * A <HistoryTable> component
 * @param 	{object}	prop	Properties passed to the component
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
			name: "tx_name",
			field: "Transaction Type",
			sorting: true,
			show: "Avatar",
			parameter_type_id: 12,
			display_media_id: DisplayMedia.SCREEN,
		},
		{
			name: "description",
			field: "Description",
			show: "Description",
			parameter_type_id: 12,
		},
		{
			name: "tid",
			field: "Transaction ID",
			sorting: true,
			parameter_type_id: 11,
			pattern_format: "#### #### #",
			display_media_id: DisplayMedia.SCREEN,
		},
		{
			name: "amount",
			field: "Amount",
			sorting: true,
			show: "Payment",
			parameter_type_id: 9,
			display_media_id: DisplayMedia.SCREEN,
		},
		{
			name: "datetime",
			field: "Date & Time",
			sorting: true,
			show: getViewComponent(14),
			parameter_type_id: 14,
			display_media_id: DisplayMedia.SCREEN,
		},
		{
			name: "status",
			show: "Tag",
			display_media_id: DisplayMedia.SCREEN,
		},

		// Below are the extra fields shown upon expanding a row...

		{
			name: "status",
			field: "Status",
			parameter_type_id: 12,
			display_media_id: DisplayMedia.BOTH,
		},
		{
			name: "fee",
			field: "Customer Charges",
			show: getViewComponent(9),
			parameter_type_id: 9,
			display_media_id: DisplayMedia.SCREEN,
		},
		{
			name: "commission_earned",
			field: "Commission Earned",
			show: getViewComponent(9),
			parameter_type_id: 9,
			display_media_id: DisplayMedia.SCREEN,
		},
		{
			name: "r_bal",
			field: "Balance Amount",
			show: getViewComponent(9),
			parameter_type_id: 9,
			display_media_id: DisplayMedia.SCREEN,
		},

		// Add new fields below ------------------------------------

		// After RBI Audit: Show customers that their Fee=1% (print receipt & SMS)	[2018-10-31]
		{
			name: "customer_fee",
			field: "Customer Charges",
			parameter_type_id: 12,
			display_media_id: DisplayMedia.PRINT,
		},

		{
			name: "bonus",
			field: "Bonus",
			parameter_type_id: 12,
			display_media_id: DisplayMedia.SCREEN,
		},

		{
			name: "tds",
			field: "TDS",
			parameter_type_id: 10,
			display_media_id: DisplayMedia.SCREEN,
		},

		{
			name: "eko_service_charge",
			field: "Service Charge",
			show: getViewComponent(9),
			parameter_type_id: 9,
			display_media_id: DisplayMedia.SCREEN,
		}, // For Enterprise
		{
			name: "eko_gst",
			field: "GST",
			show: getViewComponent(9),
			parameter_type_id: 9,
			display_media_id: DisplayMedia.SCREEN,
		}, // For Enterprise

		{
			name: "customer_mobile",
			field: "Customer Mobile",
			parameter_type_id: 15,
			// display_media_id: DisplayMedia.BOTH,
		},
		{
			name: "trackingnumber",
			field: "Tracking Number",
			parameter_type_id: 11,
			// display_media_id: DisplayMedia.BOTH,
		},
	];

	return (
		<>
			<Table
				renderer={renderer}
				visibleColumns={6}
				data={processedData}
				variant="stripedActionExpand"
				tableName="History"
				ResponsiveCard={HistoryCard}
				tableRowLimit={tableRowLimit}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
				printExpansion={true}
			/>
		</>
	);
};

export default HistoryTable;
