import { Table } from "components";
import { DetailedStatementCard } from "..";

/**
 * Detailed statement table parameter list
 */
const detailedStatementTableParameterList = [
	{
		name: "transaction_id",
		label: "TID",
	},
	{
		name: "date_time",
		label: "Date & Time",
		sorting: true,
		show: "DateTime",
	},
	{ name: "activity", label: "Activity" },
	{
		name: "description",
		label: "Description",
		show: "Description",
	},
	{ name: "amount", label: "Amount", show: "Payment" },
	{ name: "running_balance", label: "Running Balance", show: "Amount" },
];

/**
 * A DetailedStatementTable page-component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatementTable></DetailedStatementTable>`
 */

const DetailedStatementTable = ({
	pageNumber,
	totalRecords,
	setPageNumber,
	detailedStatementData,
}) => {
	return (
		<Table
			{...{
				pageNumber,
				totalRecords,
				setPageNumber,
				isReceipt: true,
				data: detailedStatementData,
				ResponsiveCard: DetailedStatementCard,
				renderer: detailedStatementTableParameterList,
			}}
		/>
	);
};

export default DetailedStatementTable;
