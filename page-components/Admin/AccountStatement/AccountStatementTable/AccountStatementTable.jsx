import { Tables } from "components";
import { mockData } from "constants/mockTableData";

/**
 * A <AccountStatementTable> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<AccountStatementTable></AccountStatementTable>`
 */

const AccountStatementTable = () => {
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
	];

	return (
		<>
			<Tables
				pageLimit={10}
				renderer={renderer}
				data={mockData}
				variant="evenStriped"
				tableName="Account"
			/>
		</>
	);
};

export default AccountStatementTable;
