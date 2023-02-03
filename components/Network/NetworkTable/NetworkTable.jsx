import { mockData } from "constants/mockTableData";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";
import { Tables } from "../..";

const NetworkTable = () => {
	const router = useRouter();
	const recordCound = 10;

	let data = useRequest({
		baseUrl: `http://192.168.1.83:25008/ekoicici/v1/network/agents?initiator_id=9911572989&user_code=99029899&org_id=1&source=WLC&record_count=${recordCound}&client_ref_id=202301031354123456`,
	});

	console.log("data", data);

	const redirect = () => {
		//TODO add props to have dynamic routes according to clicks
		router.push(`my-network/profile/`);
	};
	const renderer = [
		{ name: "", field: "Sr. No." },
		{ name: "name", field: "Name", sorting: true, show: "Avatar" },
		{
			name: "mobile_number",
			field: "Mobile Number",
			sorting: true,
		},
		{ name: "type", field: "Type", sorting: true },
		{
			name: "createdAt",
			field: "Onboarded On",
			sorting: true,
		},
		{
			name: "account_status",
			field: "Account Status",
			sorting: true,
			show: "Tag",
		},
		{ name: "ekocsp_code", field: "Eko Code", sorting: true },
		{
			name: "location",
			field: "Location",
			sorting: true,
			show: "IconButton",
		},
		{ name: "", field: "", show: "Modal" },
		{ name: "", field: "", show: "Arrow" },
	];

	/* data ✔ || pagesize ✔ || order ✔ */

	return (
		<>
			<Tables
				pageLimit={recordCound}
				renderer={renderer}
				data={mockData}
				redirect={redirect}
				variant="evenStripedClickableRow"
			/>
		</>
	);
};

export default NetworkTable;
