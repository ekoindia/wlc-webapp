import { mockData } from "constants/mockTableData";
import { Tables } from "../../../..";

const DetailedStatementTable = () => {
	const renderer = [
		{
			name: "mobile_number",
			field: "Transaction ID",
		},
		{
			name: "createdAt",
			field: "Date & Time",
			sorting: true,
		},
		{ name: "type", field: "Activity" },
		{
			name: "type",
			field: "Description",
		},
		{ name: "ekocsp_code", field: "Amount" },
		{ name: "ekocsp_code", field: "Running Balance" },
	];

	return (
		<>
			<Tables pageLimit={10} renderer={renderer} data={mockData} />
		</>
	);
};

export default DetailedStatementTable;
