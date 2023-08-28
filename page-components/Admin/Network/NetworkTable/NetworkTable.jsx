import { Table } from "components";
import { useRouter } from "next/router";
import { NetworkCard } from "..";

/**
 * A NetworkTable page-component
 * TODO: This is my network table which will redirect to Retailer details on row click
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkTable></NetworkTable>`
 */
const NetworkTable = ({
	pageNumber,
	setPageNumber,
	totalRecords,
	agentDetails,
}) => {
	const renderer = [
		{ label: "Sr. No.", show: "#" },
		{ name: "agent_name", label: "Name", sorting: true, show: "Avatar" },
		{ name: "agent_mobile", label: "Mobile Number", sorting: true },
		{ name: "agent_type", label: "Type", sorting: true },
		{
			name: "onboarded_on",
			label: "Onboarded On",
			sorting: true,
			show: "Date",
		},
		{
			name: "account_status",
			label: "Account Status",
			sorting: true,
			show: "Tag",
		},
		{ name: "eko_code", label: "User Code", sorting: true },
		{
			name: "location",
			label: "Location",
			sorting: true,
			show: "IconButton",
		},
		{ name: "", label: "", show: "Modal" },
		{ name: "", label: "", show: "Arrow" },
	];
	const router = useRouter();
	const onRowClick = (rowData) => {
		const mobile = rowData?.agent_mobile;
		localStorage.setItem("network_seller_details", JSON.stringify(rowData));
		router.push({
			pathname: `/admin/my-network/profile`,
			query: { mobile },
		});
	};

	return (
		<>
			<Table
				onRowClick={onRowClick}
				renderer={renderer}
				variant="stripedActionRedirect"
				tableName="Network"
				totalRecords={totalRecords}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
				data={agentDetails}
				ResponsiveCard={NetworkCard}
			/>
		</>
	);
};

export default NetworkTable;
