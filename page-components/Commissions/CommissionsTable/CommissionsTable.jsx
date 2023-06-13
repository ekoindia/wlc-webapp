import { Table } from "components";
import { getCommissionsTableProcessedData } from ".";
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
	transactionList,
	tagClicked,
}) => {
	const processedData = getCommissionsTableProcessedData(transactionList);
	console.log("tagclickedhere", tagClicked);
	let renderer = [];
	switch (tagClicked) {
		case "DMT (Send Cash)":
			renderer = [
				{
					name: "packs",
					field: "Packs",
					sorting: false,
					show: "Packs",
				},
				{
					name: "commission",
					field: "Commission",
					show: "Commission",
				},
			];
			break;
		case "AePS Cashout":
			renderer = [
				{
					name: "transaction_value",
					field: "Transaction Value",
					show: "Transaction Value",
				},
				{
					name: "commission",
					field: "Commission",
					show: "Commission",
				},
			];
			break;
		case "Bharat Bill Pay":
			renderer = [
				{
					name: "transaction_value",
					field: "Transaction Value",
					show: "Transaction Value",
				},
				{
					name: "commission",
					field: "Commission",
					show: "Commission",
				},
			];
			break;
		case "Indo-Nepal":
			renderer = [
				{
					name: "premium_amount_per_year",
					field: "Premium Amount Per Year",
					show: "Premium Amount Per Year ",
				},
				{
					name: "commission",
					field: "Commission",
					show: "Commission",
				},
			];
			break;
		case "Edelweiss Insurance":
			renderer = [
				{
					name: "premium_amount_per_year",
					field: "Premium Amount Per Year",
					show: "Premium Amount Per Year ",
				},
				{
					name: "commission",
					field: "Commission",
					show: "Commission",
				},
			];
			break;
		case "CMS":
			renderer = [
				{
					name: "biller_name",
					field: "Biller Name",
					show: "Biller Name",
				},
				{
					name: "merchant_commission",
					field: "Merchant Commission",
					show: "Merchant Commission",
				},
			];
			break;
		default:
			console.log("Unknown tagClicked value:", tagClicked);
			break;
	}

	return (
		<>
			<Table
				renderer={renderer}
				visibleColumns={2}
				data={processedData}
				variant="stripedActionExpand"
				tableName="Commissions"
				ResponsiveCard={CommissionsCard}
				tableRowLimit={tableRowLimit}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
			/>
		</>
	);
};

export default CommissionsTable;
