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
 * @param root0
 * @param root0.commissionData
 * @param root0.setPageNumber
 * @param root0.tableRowLimit
 * @param root0.totalRecords
 * @param root0.pageNumber
 * @param root0.tag
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
