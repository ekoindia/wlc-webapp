import { Table } from "components";
import { DetailedStatementCard } from "..";

/**
 * A <DetailedStatementTable> component
 * TODO: This is detailed statement table with not clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatementTable></DetailedStatementTable>`
 */

const DetailedStatementTable = ({
	detailedStatementData,
	pageNumber,
	setPageNumber,
	totalRecords,
}) => {
	const renderer = [
		{
			name: "transaction_id",
			label: "TID",
		},
		{
			name: "date_time",
			label: "Date & Time",
			sorting: true,
			show: "DateTime",
		},
		{ name: "activity", label: "Activity" },
		{
			name: "description",
			label: "Description",
			show: "Description",
		},
		{ name: "amount", label: "Amount", show: "Payment" },
		{ name: "running_balance", label: "Running Balance", show: "Amount" },
	];

	return (
		<>
			<Table
				renderer={renderer}
				data={detailedStatementData}
				tableName="Detailed"
				totalRecords={totalRecords}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
				ResponsiveCard={DetailedStatementCard}
				isReceipt={true}
			/>
		</>
	);
};

export default DetailedStatementTable;
