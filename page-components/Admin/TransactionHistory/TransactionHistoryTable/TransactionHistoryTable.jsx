import { Table } from "components";
import { apisHelper } from "helpers/apisHelper";
import { useRouter } from "next/router";

const datadummy = {
	response_status_id: 1,
	data: {
		client_ref_id: "202301031354123456",
		transaction_details: [
			{
				agent_type: "I-CSP",
				saving_balance: "1000000.000",
				agent_name: "Airwave Teleservices",
				latitude: "28.65561600",
				location: "GurgaonHaryana",
				agent_mobile: "9768685676",
				account_status: "Agreement Pending",
				longitude: "77.20468480",
			},
		],
	},
	response_type_id: 1803,
	message: "Success! Transaction History Found!",
	status: 1803,
};
/**
//  * A <TransactionHistoryTable> component
 * TODO: This is transaction history table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistoryTable></TransactionHistoryTable>`
 */
const TransactionHistoryTable = (searchValue) => {
    console.log('searchValue', searchValue)
	const router = useRouter();
	const apidata = apisHelper("Transaction", searchValue);
	// console.log("apidata", apidata);
	// console.log("apidata", apidata);
	const transactiondata = apidata?.data?.data?.transaction_details ?? [];
	console.log("transactiondata", transactiondata);

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
