import { mockData } from "constants/mockTableData";
import { Tables } from "../../..";

const AccountStatementTable = () => {
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
	];

	return (
		<>
			<Tables
				pageLimit={10}
				renderer={renderer}
				data={mockData}
				variant="evenStriped"
			/>
		</>
	);
};

export default AccountStatementTable;
