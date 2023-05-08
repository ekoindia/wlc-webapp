import { Table } from "components";

/**
 * A <AccountStatementTable> component
 * TODO: This is account statement table with not clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<AccountStatementTable></AccountStatementTable>`
 */

const AccountStatementTable = (props) => {
	const { acctabledata } = props;

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
			show: "Description",
		},

		{ name: "amount", field: "Amount" },
	];

	// <=======================API CALL===============================>

	// const Accountapicall = apisHelper("Account");
	// const AccountStatementData =
	// Accountapicall?.data?.data?.recent_transaction_details ?? [];

	// console.log(AccountStatementData, "AccountStatementData");
	return (
		<>
			<Table
				isOnclickRequire={false}
				pageLimit={15}
				renderer={renderer}
				data={acctabledata}
				variant="evenStriped"
				tableName="Account"
				ispagintationrequire={false}
			/>
		</>
	);
};

export default AccountStatementTable;
