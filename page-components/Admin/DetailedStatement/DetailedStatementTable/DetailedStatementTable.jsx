import { Table } from "components";
import { DetailedStatementCard } from "..";

/**
 * A <DetailedStatementTable> component
 * TODO: This is detailed statement table with not clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatementTable></DetailedStatementTable>`
 */

const DetailedStatementTable = (props) => {
	const { detiledData, pageNumber, setPageNumber, totalRecords } = props;

	const renderer = [
		{
			name: "transaction_id",
			field: "TID",
		},
		{
			name: "date_time",
			field: "Date & Time",
			sorting: true,
			show: "DateTime",
		},
		{ name: "activity", field: "Activity" },
		{
			name: "description",
			field: "Description",
			show: "Description",
		},
		{ name: "amount", field: "Amount", show: "Payment" },
		{ name: "running_balance", field: "Running Balance", show: "Amount" },
	];

	return (
		<>
			<Table
				renderer={renderer}
				data={detiledData}
				tableName="Detailed"
				totalRecords={totalRecords}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
				ResponsiveCard={DetailedStatementCard}
				defaultCardStyle={false}
			/>
		</>
	);
};

export default DetailedStatementTable;
