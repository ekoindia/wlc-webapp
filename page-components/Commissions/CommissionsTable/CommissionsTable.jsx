import { Table } from "components";
import { CommissionsCard } from "..";
/**
 * A <CommissionsTable> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<CommissionsTable></CommissionsTable>` TODO: Fix example
 */
const CommissionsTable = ({
	pageNumber,
	setPageNumber,
	tableRowLimit,
	commissionData,
	// tagClicked,
}) => {
	let renderer = [
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

	return (
		<>
			<Table
				renderer={renderer}
				visibleColumns={0}
				data={commissionData}
				variant="stripedActionNone"
				ResponsiveCard={CommissionsCard}
				tableRowLimit={tableRowLimit}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
			/>
		</>
	);
};

export default CommissionsTable;
