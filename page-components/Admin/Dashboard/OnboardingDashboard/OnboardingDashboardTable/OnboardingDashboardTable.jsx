import { Table } from "components";
import { table_data_mock } from "constants/table_data_mock";
/**
 * A <OnboardingDashboardTable> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<OnboardingDashboardTable></OnboardingDashboardTable>` TODO: Fix example
 */
const OnboardingDashboardTable = ({ prop1, ...rest }) => {
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
			field: "User Code",
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
				pageLimit={50}
				renderer={renderer}
				data={table_data_mock.slice(0, 20)}
				variant="evenStripedClickableRow"
				tableName="Onboarding"
				isScrollrequired={true}
				{...rest}
			/>
		</>
	);
};

export default OnboardingDashboardTable;
