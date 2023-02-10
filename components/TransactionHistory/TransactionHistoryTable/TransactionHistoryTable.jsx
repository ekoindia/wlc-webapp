import { mockData } from "constants/mockTableData";
import { useRouter } from "next/router";
import { Tables } from "../..";

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

	return (
		<>
			<Tables
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
