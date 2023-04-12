import { Table } from "components";
import { mockData } from "constants/mockTableData";

/**
 * A <OnboardingDasboardTable> component
 * TODO: This is my OnboardingDasboardTable table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDasboardTable></OnboardingDasboardTable>`
 */

const OnboardingDasboardTable = () => {
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
				pageLimit={50}
				renderer={renderer}
				data={mockData}
				variant="evenStripedClickableRow"
				tableName="Onboarding"
				isScrollrequired={true}
			/>
		</>
	);
};

export default OnboardingDasboardTable;
