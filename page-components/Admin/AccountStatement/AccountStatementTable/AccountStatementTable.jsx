import { Text } from "@chakra-ui/react";
import { Table } from "components";
import { tableRowLimit } from "constants";
import { AccountStatementCard } from "..";

/**
 * Parameter list for account statement table
 */
const accountStatementTableParameterList = [
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

/**
 * A AccountStatementTable page-component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<AccountStatementTable></AccountStatementTable>`
 */

const AccountStatementTable = ({ isLoading, accountStatementTableData }) => {
	const accountTableDataSize = accountStatementTableData?.length ?? 0;

	if (!isLoading && accountTableDataSize < 1) {
		return (
			<Text textAlign="center" color="light">
				Nothing Found
			</Text>
		);
	}

	return (
		<Table
			{...{
				isLoading,
				isReceipt: true,
				data: accountStatementTableData,
				tableRowLimit: tableRowLimit?.XLARGE,
				ResponsiveCard: AccountStatementCard,
				renderer: accountStatementTableParameterList,
			}}
		/>
	);
};

export default AccountStatementTable;
