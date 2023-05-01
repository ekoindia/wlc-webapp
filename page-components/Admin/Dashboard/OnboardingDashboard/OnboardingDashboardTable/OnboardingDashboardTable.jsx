import { Table } from "components";
/**
 * A <OnboardingDashboardTable> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<OnboardingDashboardTable></OnboardingDashboardTable>` TODO: Fix example
 */
const OnboardingDashboardTable = ({ tableData }) => {
	const renderer = [
		{ name: "", field: "", show: "Accordian" },
		{
			name: "merchantName",
			field: "Merchant's Name",
			sorting: true,
			show: "Avatar",
		},
		{
			name: "ekoCode",
			field: "Eko Code",
			sorting: true,
		},

		{
			name: "city",

			field: "Location",

			sorting: true,
		},
		{
			name: "businesstType",
			field: "Business Type",
			sorting: true,
		},
		{
			name: "onboardedOn",
			field: "Onboarded on",

			sorting: true,
		},
	];

	const rendererExpandedRow = [
		{ name: "businessName", field: "Business Name " },
		{ name: "daysinFunnelr", field: "Days in funnel" },
		{ name: "businessDetailsCaptured", field: "Business details captured" },
		{ name: "aadhaarCaptured", field: "Aadhaar captured" },
		{ name: "panCaptured", field: "PAN captured " },
		{ name: "account_status", field: "e-KYC done" },
		{ name: "agreementSigned", field: "Agreement signed" },
		{ name: "onboarded", field: "Onboarded" },
		{ name: "transacting", field: "Transacting" },
	];
	return (
		<>
			<Table
				pageLimit={50}
				renderer={renderer}
				rendererExpandedRow={rendererExpandedRow}
				data={tableData}
				variant="evenStripedClickableRow"
				tableName="Onboarding"
				isScrollrequired={true}
				accordian={true}
				isPaginationRequired={false}
				isOnclickRequire={false}
			/>
		</>
	);
};

export default OnboardingDashboardTable;
