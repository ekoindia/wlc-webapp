import { Table } from "components";
import { mockData } from "constants/mockTableData";

/**
 * A <NetworkTable> component
 * TODO: This is my network table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkTable></NetworkTable>`
 */

const NetworkTable = () => {
	const recordCound = 10;

	const renderer = [
		{ name: "", field: "Sr. No." },
		{
			name: "name",
			field: "Merchant's Name",
			sorting: true,
			show: "Avatar",
		},
		{
			name: "mobile_number",
			field: "Eko Code",
			sorting: true,
		},
		{ name: "type", field: "Ref. ID", sorting: true },
		{
			name: "type",
			field: "Location",

			sorting: true,
		},
		{
			name: "createdAt",
			field: "Business Type",
			sorting: true,
		},
		{
			name: "account_status",
			field: "Onboarded on",
			show: "Tag",
			sorting: true,
		},
	];

	return (
		<>
			<Table
				pageLimit={recordCound}
				renderer={renderer}
				data={mockData}
				variant="evenStripedClickableRow"
				tableName="Network"
			/>
		</>
	);
};

export default NetworkTable;
