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
			name: "mobile_number",
			field: "Transaction ID",
		},
		{
			name: "createdAt",
			field: "Date & Time",
			sorting: true,
		},
		{ name: "type", field: "Activity" },
		{
			name: "type",
			field: "Description",
		},
		{ name: "ekocsp_code", field: "Amount" },
		{ name: "ekocsp_code", field: "Running Balance" },
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
