import { Table } from "components";
import { apisHelper } from "helpers/apisHelper";

// import { mockData } from "constants/mockTableData";

/**
 * A <AccountStatementTable> component
 * TODO: This is account statement table with not clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<AccountStatementTable></AccountStatementTable>`
 */

const AccountStatementTable = () => {
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

		{ name: "amount", field: "Amount" },
	];

	// <=======================API CALL===============================>

	const Accountapicall = apisHelper("Account");
	const AccountStatementData =
		Accountapicall?.data?.data?.recent_transaction_details ?? [];

	console.log(AccountStatementData, "AccountStatementData");
	return (
		<>
			<Table
				pageLimit={15}
				renderer={renderer}
				data={AccountStatementData}
				variant="evenStriped"
				tableName="Account"
			/>
		</>
	);
};

export default AccountStatementTable;
