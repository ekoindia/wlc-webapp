import { Table } from "components";
import { table_data_mock } from "constants/table_data_mock";

/**
 * A <BusinessDashboardTable> component
 * TODO: This is my network table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BusinessDashboardTable></BusinessDashboardTable>`
 */

const BusinessDashboardTable = () => {
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
				renderer={renderer}
				data={table_data_mock.slice(0, 20)}
				variant="evenStriped"
				tableName="Business"
				isScrollrequired={true}
				border="none"
				scrollCSS={{}}
			/>
		</>
	);
};

export default BusinessDashboardTable;
