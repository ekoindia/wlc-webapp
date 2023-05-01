import { Table } from "components";

/**
 * A <BusinessDashboardTable> component
 * TODO: This is my network table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BusinessDashboardTable></BusinessDashboardTable>`
 */

const BusinessDashboardTable = ({ tableData }) => {
	const renderer = [
		{ name: "", field: "Sr. No." },
		{ name: "name", field: "Name", sorting: true, show: "Avatar" },
		{
			name: "gtv",
			field: "GTV",
			sorting: true,
		},
		{
			name: "totalTransactions",
			field: "Total Transaction",
			sorting: true,
		},
		{
			name: "status",
			field: "Status",
			show: "Tag",
			sorting: true,
		},
		{
			name: "raCases",
			field: "RA Cases",
			sorting: true,
		},
		{ name: "onboardingDate", field: "Onboarding Date", sorting: true },

		{
			name: "distributorMapped",
			field: "Distributor Mapped",
			sorting: true,
		},
	];

	return (
		<>
			<Table
				renderer={renderer}
				data={tableData}
				variant="evenStriped"
				tableName="Business"
				border="none"
			/>
		</>
	);
};

export default BusinessDashboardTable;
