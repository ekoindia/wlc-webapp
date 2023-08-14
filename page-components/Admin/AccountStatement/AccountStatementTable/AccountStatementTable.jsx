import { Table } from "components";
import { tableRowLimit } from "constants";
import { AccountStatementCard } from "..";

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

		{ name: "amount", label: "Amount", show: "Amount" },
	];

	return (
		<>
			<Table
				tableRowLimit={tableRowLimit?.XLARGE}
				renderer={renderer}
				data={acctabledata}
				tableName="Account"
				ResponsiveCard={AccountStatementCard}
				isReceipt={true}
			/>
		</>
	);
};

export default AccountStatementTable;
