import { Table } from "components";
import { mockData } from "constants/mockTableData";

/**
 * A <NetworkTable> component
 * TODO: This is my network table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkTable></NetworkTable>`
 */

const BusinessTable = () => {
	const recordCound = 10;

	const renderer = [
		{ name: "", field: "Sr. No." },
		{ name: "name", field: "Name", sorting: true, show: "Avatar" },
		{
			name: "mobile_number",
			field: "GTV",
			sorting: true,
		},
		{ name: "type", field: "Total Transaction", sorting: true },
		{
			name: "account_status",
			field: "Status",
			show: "Tag",
			sorting: true,
		},
		{
			name: "createdAt",
			field: "RA Cases",
			sorting: true,
		},
		{ name: "ekocsp_code", field: "Onboarding Date", sorting: true },

		{ name: "name", field: "Distributor Mapped", sorting: true },
	];

	return (
		<>
			<Table
				pageLimit={mockData.length}
				renderer={renderer}
				data={mockData}
				variant="evenStriped"
				tableName="Business"
				isScrollrequired={true}
				border="none"
				scrollCSS={{}}
			/>
		</>
	);
};

export default BusinessTable;
