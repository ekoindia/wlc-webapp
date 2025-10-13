import { Table } from "components";
import { useRouter } from "next/router";
import { TransactionHistoryCard } from "..";

const trxnHistoryTableParameterList = [
	{ label: "Sr. No.", show: "#" },
	{ name: "agent_name", label: "Name", show: "Avatar", sorting: true },
	{
		name: "agent_mobile",
		label: "Mobile",
		sorting: true,
	},
	{ name: "agent_type", label: "Type", sorting: true },
	{
		name: "account_status",
		label: "Account Status",
		sorting: true,
		show: "Tag",
	},
	{
		name: "location",
		label: "Location",
		show: "Address",
	},
	{
		name: "",
		label: "",
		show: "Arrow",
	},
];

/**
 * A TransactionHistoryTable component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.trxnData
 * @example	`<TransactionHistoryTable></TransactionHistoryTable>`
 */
const TransactionHistoryTable = ({ trxnData }) => {
	const router = useRouter();

	const onRowClick = () => {
		const mobile = trxnData[0]?.agent_mobile ?? "";
		router.push({
			pathname: "/admin/transaction-history/account-statement",
			query: { mobile },
		});
	};

	return (
		<Table
			onRowClick={onRowClick}
			variant="stripedActionRedirect"
			renderer={trxnHistoryTableParameterList}
			data={trxnData}
			ResponsiveCard={TransactionHistoryCard}
		/>
	);
};

export default TransactionHistoryTable;
