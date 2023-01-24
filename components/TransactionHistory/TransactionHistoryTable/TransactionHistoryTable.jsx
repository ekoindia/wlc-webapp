import { mockData } from "constants/mockTableData";
import { Tables } from "../..";

const TransactionHistoryTable = () => {
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
		{ name: "", field: "", show: "ArrowForward" },
	];

	return (
		<>
			<Tables pageLimit={10} renderer={renderer} data={mockData} />
		</>
	);
};

export default TransactionHistoryTable;
