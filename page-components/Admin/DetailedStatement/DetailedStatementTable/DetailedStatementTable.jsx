import { Table } from "components";
import { mockData } from "constants/mockTableData";

/**
 * A <DetailedStatementTable> component
 * TODO: This is detailed statement table with not clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatementTable></DetailedStatementTable>`
 */

const DetailedStatementTable = () => {
	const renderer = [
		{
			name: "transaction_id",
			field: "Transaction ID",
		},
		{
			name: "date_time",
			field: "Date & Time",
			sorting: true,
		},
		{ name: "activity", field: "Activity" },
		{
			name: "description",
			field: "Description",
		},
		{ name: "amount", field: "Amount", show: "debit_credit" },
		{ name: "running_balance", field: "Running Balance" },
	];

	return (
		<>
			<Table
				pageLimit={10}
				renderer={renderer}
				data={mockData}
				variant="evenStriped"
				tableName="Detailed"
			/>
		</>
	);
};

export default DetailedStatementTable;
