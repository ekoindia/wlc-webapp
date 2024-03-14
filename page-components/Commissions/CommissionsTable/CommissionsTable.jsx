import { Table } from "components";
import { CommissionsCard } from "..";

const commissionTableParameterList = [
	{
		name: "transaction_value",
		label: "Transaction Value",
	},
	{
		name: "biller_name",
		label: "Biller Name",
	},
	{
		name: "commission",
		label: "Commission",
	},
];

/**
 * The CommissionsTable component displays a table of commission data.
 */
const CommissionsTable = ({
	commissionData,
	setPageNumber,
	tableRowLimit,
	totalRecords,
	pageNumber,
	tag,
}) => {
	// If tag is 'money_transfer', remove 'biller_name' from the table
	let tableParameters = commissionTableParameterList;
	if (tag === "money_transfer") {
		tableParameters = commissionTableParameterList.filter(
			(param) => param.name !== "biller_name"
		);
	}

	return (
		<>
			<Table
				{...{
					renderer: tableParameters,
					ResponsiveCard: CommissionsCard,
					data: commissionData,
					setPageNumber,
					tableRowLimit,
					totalRecords,
					pageNumber,
				}}
			/>
		</>
	);
};

export default CommissionsTable;
