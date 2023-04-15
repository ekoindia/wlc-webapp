import { Table } from "components";
import { mockData } from "constants/mockTableData";

/**
 * A <DetailedStatementTable> component
 * TODO: This is detailed statement table with not clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatementTable></DetailedStatementTable>`
 */

const TransactionTable = () => {
	const renderer = [
		{ name: "", field: "", show: "Accordian" },
		{
			name: "name",
			field: "Transaction Type",
			sorting: true,
			show: "Avatar",
		},

		{
			name: "createdAt",
			field: "Description",
			sorting: true,
		},
		{ name: "type", field: "Transaction ID", sorting: true },
		{
			name: "type",
			field: "Amount",
			sorting: true,
		},
		{ name: "ekocsp_code", field: "Date", sorting: true },
		{ name: "ekocsp_code", field: "Time", sorting: true },
		{
			name: "account_status",

			show: "Tag",
		},
	];

	return (
		<>
			<Table
				pageLimit={10}
				renderer={renderer}
				data={mockData.slice(0, 10)} // only show the first 15 items
				variant="darkStriped"
				tableName="Transactions"
				accordian={true}
				isPaginationRequired={false}
				isOnclickRequire={false}
			/>
		</>
	);
};

export default TransactionTable;
