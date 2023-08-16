import { Table } from "components";

/**
 * A BulkOnboardingResponse page-component, to show result after user uploaded list of users to be onboarded on platform
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BulkOnboardingResponse></BulkOnboardingResponse>`
 */
const BulkOnboardingResponse = ({
	// totalRecords,
	// pageNumber,
	// setPageNumber,
	bulkOnboardingResponseList,
}) => {
	const renderer = [
		{ label: "Sr. No.", show: "#" },
		{ name: "name", label: "Name", sorting: true, show: "Avatar" },
		{ name: "mobile", label: "Mobile Number", sorting: true },
		{
			name: "status",
			label: "Status",
			sorting: true,
			show: "Tag",
		},
		{
			name: "reason",
			label: "Reason",
			show: "Description",
		},
	];
	return (
		<Table
			tableName="BulkOnboarding"
			variant="stripedActionNone"
			renderer={renderer}
			// totalRecords={totalRecords}
			// pageNumber={pageNumber}
			// setPageNumber={setPageNumber}
			data={bulkOnboardingResponseList}
		/>
		//TODO table responsive card
	);
};

export default BulkOnboardingResponse;
