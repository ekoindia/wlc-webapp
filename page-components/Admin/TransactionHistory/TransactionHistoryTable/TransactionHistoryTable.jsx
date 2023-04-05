import { Table } from "components";
import { useRouter } from "next/router";
/**
//  * A <TransactionHistoryTable> component
 * TODO: This is transaction history table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistoryTable></TransactionHistoryTable>`
 */
const TransactionHistoryTable = (props) => {
	const { searchValue, transactiondata } = props;
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
	const cellnumber = transactiondata[0]?.agent_mobile ?? [];
	function onRowClick() {
		router.push({
			pathname: "/admin/transaction-history/account-statement",
			query: { cellnumber },
		});
	}

	return (
		<>
			<Table
				onRowClick={onRowClick}
				pageLimit={10}
				renderer={renderer}
				data={transactiondata}
				variant="evenStripedClickableRow"
				tableName="Transaction"
				ispagintationrequire={false}
			/>
		</>
	);
};

export default TransactionHistoryTable;
