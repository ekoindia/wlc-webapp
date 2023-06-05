import { Table } from "components";
import { tableRowLimit, tableVariant } from "constants";
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
			field: "Transaction ID",
		},
		{
			name: "date_time",
			field: "Date & Time",
			sorting: true,
			show: "DateView",
		},
		{ name: "activity", field: "Activity" },
		{
			name: "description",
			field: "Description",
			show: "Description",
		},

		{ name: "amount", field: "Amount", show: "Amount" },
	];

	return (
		<>
			<Table
				tableRowLimit={tableRowLimit?.LARGE}
				renderer={renderer}
				data={acctabledata}
				variant={tableVariant?.DEFAULT}
				tableName="Account"
				ispagintationrequire={false}
				ResponsiveCard={AccountStatementCard}
				defaultCardStyle={false}
			/>
		</>
	);
};

export default AccountStatementTable;
