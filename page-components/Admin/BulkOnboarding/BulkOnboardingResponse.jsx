import { Table } from "components";

/**
 * A BulkOnboardingResponse page-component, to show result after user uploaded list of users to be onboarded on platform
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BulkOnboardingResponse></BulkOnboardingResponse>`
 */
const BulkOnboardingResponse = ({
	totalRecords,
	pageNumber,
	setPageNumber,
	bulkOnboardingResponseData,
}) => {
	const renderer = [
		{ field: "Sr. No.", show: "#" },
		{ name: "agent_name", field: "Name", sorting: true, show: "Avatar" },
		{ name: "agent_mobile", field: "Mobile Number", sorting: true },
		{
			name: "account_status",
			field: "Status",
			sorting: true,
			show: "Tag",
		},
	];
	return (
		<Table
			tableName="BulkOnboarding"
			variant="stripedActionNone"
			renderer={renderer}
			totalRecords={totalRecords}
			pageNumber={pageNumber}
			setPageNumber={setPageNumber}
			data={bulkOnboardingResponseData}
		/>
	);
};

export default BulkOnboardingResponse;
