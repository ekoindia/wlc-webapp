import { Table } from "components";
import { mockData } from "constants/mockTableData";
import { useRouter } from "next/router";

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
		{ name: "name", field: "Name", sorting: true, show: "Avatar" },
		{
			name: "mobile_number",
			field: "Mobile Number",
			sorting: true,
		},
		{ name: "type", field: "Type", sorting: true },
		{
			name: "createdAt",
			field: "Account Number",
			sorting: true,
		},
		{
			name: "account_status",
			field: "Account Status",
			sorting: true,
			show: "Tag",
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
	return (
		<>
			<Table
				onClck={onRowClick}
				pageLimit={10}
				renderer={renderer}
				data={mockData}
				variant="evenStripedClickableRow"
				tableName="Transaction"
			/>
		</>
	);
};

export default TransactionHistoryTable;
