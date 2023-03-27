import { Table } from "components";
import { mockData } from "constants/mockTableData";
import { useRouter } from "next/router";
import { apisHelper } from "helpers/apisHelper";
/**
 * A <TransactionHistoryTable> component
 * TODO: This is transaction history table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistoryTable></TransactionHistoryTable>`
 */
const TransactionHistoryTable = () => {
	const router = useRouter();

	const renderer = [
		{ name: "", field: "Sr. No." },
		{ name: "agent_name", field: "Name", sorting: true, show: "Avatar" },
		{
			name: "agent_mobile",
			field: "Mobile Number",
			sorting: true,
		},
		{ name: "agent_type", field: "Type", sorting: true },
		// {
		// 	name: "createdAt",
		// 	field: "Account Number",
		// 	sorting: true,
		// },
		{
			name: "account_status",
			field: "Account Status",
			sorting: true,
		},
		{
			name: "location",
			field: "Location",
			sorting: true,
			show: "IconButton",
		},
		{
			name: "",
			field: "",
			show: "Arrow",
		},
	];

	function onRowClick() {
		const router = useRouter();
		router.push("transaction-history/account-statement/");
	}

	/* api call*/
	const trasaction_historyapicall = apisHelper("Transaction");
	const TransactionHistorytData =
		trasaction_historyapicall?.data?.data?.transaction_details ?? [];

	console.log(TransactionHistorytData, "AccountStatementData");

	return (
		<>
			<Table
				onClck={onRowClick}
				pageLimit={10}
				renderer={renderer}
				data={TransactionHistorytData}
				variant="evenStripedClickableRow"
				tableName="Transaction"
			/>
		</>
	);
};

export default TransactionHistoryTable;
