import { Table } from "components";
import { useRouter } from "next/router";
import { TransactionHistoryCard } from "..";
/**
//  * A <TransactionHistoryTable> component
 * TODO: This is transaction history table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistoryTable></TransactionHistoryTable>`
 */
const TransactionHistoryTable = ({ /* searchValue, */ transactiondata }) => {
	// console.log("transactiondata", transactiondata);
	const renderer = [
		{ label: "Sr. No.", show: "#" },
		{ name: "agent_name", label: "Name", sorting: true, show: "Avatar" },
		{
			name: "agent_mobile",
			label: "Mobile Number",
			sorting: true,
		},
		{ name: "agent_type", label: "Type", sorting: true },
		// {
		// 	name: "createdAt",
		// 	label: "Account Number",
		// 	sorting: true,
		// },
		{
			name: "account_status",
			label: "Account Status",
			sorting: true,
		},
		{
			name: "location",
			label: "Location",
			sorting: true,
			show: "IconButton",
		},
		{
			name: "",
			label: "",
			show: "Arrow",
		},
	];

	const router = useRouter();

	const onRowClick = () => {
		const mobile = transactiondata[0]?.agent_mobile ?? "";
		router.push({
			pathname: "/admin/transaction-history/account-statement",
			query: { mobile },
		});
	};

	return (
		<>
			<Table
				onRowClick={onRowClick}
				variant="stripedActionRedirect"
				renderer={renderer}
				data={transactiondata}
				ResponsiveCard={TransactionHistoryCard}
			/>
		</>
	);
};

export default TransactionHistoryTable;
