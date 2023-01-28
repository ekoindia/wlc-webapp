import { mockData } from "constants/mockTableData";
import { useRouter } from "next/router";
import { Tables } from "../..";

const NetworkTable = () => {
	const router = useRouter();
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
				pageLimit={10}
				renderer={renderer}
				data={mockData}
				redirect={redirect}
			/>
		</>
	);
};

export default NetworkTable;
