import { Table } from "components";
import { useUser } from "contexts/UserContext";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";
import { useState } from "react";
/**
 * A <NetworkTable> component
 * TODO: This is my network table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkTable></NetworkTable>`
 */

const NetworkTable = ({
	sortValue,
	searchValue = "34535345435",
	filter = {
		agentType: "csp",
		agentAccountStatus: "Active",
		onBoardingDateFrom: "2017-08-03",
		onBoardingDateTo: "2018-04-11",
	},
}) => {
	const [pageNumber, setPageNumber] = useState(1);
	const { userData } = useUser();
	const renderer = [
		{ name: "", field: "Sr. No." },
		{ name: "agent_name", field: "Name", sorting: true, show: "Avatar" },
		{ name: "agent_mobile", field: "Mobile Number", sorting: true },
		{ name: "agent_type", field: "Type", sorting: true },
		{ name: "onboarded_on", field: "Onboarded On", sorting: true },
		{
			name: "account_status",
			field: "Account Status",
			sorting: true,
			show: "Tag",
		},
		{ name: "eko_code", field: "Eko Code", sorting: true },
		{
			name: "location",
			field: "Location",
			sorting: true,
			show: "IconButton",
		},
		{ name: "", field: "", show: "Modal" },
		{ name: "", field: "", show: "Arrow" },
	];
	const router = useRouter();

	const { data, error, isLoading, mutate, revalidate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: {
			"tf-req-uri-root-path": "/ekoicici/v1",
			"tf-req-uri": `/network/agents?initiator_id=9911572989&user_code=99029899&org_id=1&source=WLC&record_count=10&client_ref_id=202301031354123456&page_number=${pageNumber}`,
			"tf-req-method": "GET",
			authorization: `Bearer ${userData.access_token}`,
		},
	});

	let postData = "";
	if (searchValue) postData += `searchValue=${searchValue}`;
	if (Object.keys(filter).length) {
		let filterKeys = Object.keys(filter);
		let filterQuery = "filter=true";
		filterKeys.forEach((ele) => {
			filterQuery += `&${ele}=${filter[ele]}`;
			// filterQuery += `filter=true&agentType=${}&agentType=${}&agentAccountStatus=${}&onBoardingDateFrom=${}&=${}&=${}`
		});
		if (postData != "") postData += "&" + filterQuery;
		else postData += filterQuery;
	}
	if (sortValue) {
		if (postData != "") postData += `&sortValue=${sortValue}`;
		else postData += `sortValue=${sortValue}`;
	}

	const totalRecords = data?.data?.TotalRecords;
	const agentDetails = data?.data?.agent_details ?? [];

	const onRowClick = (rowData) => {
		const ekocode = rowData.eko_code;
		localStorage.setItem("rowData", JSON.stringify(rowData));
		router.push({
			pathname: "/admin/my-network/profile",
			query: { ekocode },
			state: { rowData },
		});
	};

	return (
		<>
			<Table
				onRowClick={onRowClick}
				pageLimit="10"
				renderer={renderer}
				data={agentDetails}
				variant="evenStripedClickableRow"
				tableName="Network"
				totalRecords={totalRecords}
				setPageNumber={setPageNumber}
			/>
		</>
	);
};

export default NetworkTable;
