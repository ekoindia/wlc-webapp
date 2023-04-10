import { Table } from "components";
import { useRouter } from "next/router";
/**
 * A <NetworkTable> component
 * TODO: This is my network table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkTable></NetworkTable>`
 */

const NetworkTable = ({
	sortValue,
	searchValue,
	filterValues,
	pageNumber,
	setPageNumber,
	totalRecords,
	agentDetails,
	// filter = {
	// 	agentType: "csp",
	// 	agentAccountStatus: "active",
	// 	onBoardingDateFrom: "2016-08-03",
	// 	onBoardingDateTo: "2018-04-11",
	// },
}) => {
	// let postData = "";
	// if (searchValue) postData += `search_value=${searchValue}&`;
	// if (sortValue) {
	// 	postData += `sortValue=${sortValue}&`;
	// }
	// if (Object.keys(filter).length) {
	// 	let filterKeys = Object.keys(filter);
	// 	let filterQuery = "filter=false";
	// 	filterKeys.forEach((ele) => {
	// 		filterQuery += `&${ele}=${filter[ele]}`;
	// 	});
	// 	postData += filterQuery;
	// }

	// const [pageNumber, setPageNumber] = useState(1);
	// console.log("pageNumber", pageNumber);
	// const { userData } = useUser();

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

	// let headers = {
	// 	"tf-req-uri-root-path": "/ekoicici/v1",
	// 	"tf-req-uri": `/network/agents?initiator_id=9911572989&user_code=99029899&org_id=1&source=WLC&record_count=10&client_ref_id=202301031354123456&page_number=${pageNumber}&${postData}`,
	// 	"tf-req-method": "GET",
	// };
	// const { data, error, isLoading, mutate } = useRequest({
	// 	method: "POST",
	// 	baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
	// 	headers: { ...headers },
	// 	authorization: `Bearer ${userData.access_token}`,
	// });

	// useEffect(() => {
	// 	mutate(
	// 		process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
	// 		headers
	// 	);
	// }, [pageNumber, headers["tf-req-uri"]]);

	// console.log("data", data);
	// const totalRecords = data?.data?.TotalRecords;
	// const agentDetails = data?.data?.agent_details ?? [];

	// console.log("data in network table", data);
	/* for seller details */
	const onRowClick = (rowData) => {
		const ekocode = rowData.eko_code;
		console.log("ekocode", ekocode);
		localStorage.setItem("rowData", JSON.stringify(rowData));
		router.push({
			pathname: `/admin/my-network/profile`,
			query: { ekocode },
			// state: { rowData },
		});
	};

	return (
		<>
			<Table
				onRowClick={onRowClick}
				pageLimit="10"
				renderer={renderer}
				variant="evenStripedClickableRow"
				tableName="Network"
				totalRecords={totalRecords} //table pagination
				setPageNumber={setPageNumber} //table
				pageNumber={pageNumber}
				data={agentDetails}
			/>
		</>
	);
};

export default NetworkTable;
