/* eslint-disable react-hooks/exhaustive-deps */
import { fetchOrgDetails } from "helpers/fetchOrgDetailsHelper";
import { LoginPanel } from "page-components";
import { useEffect } from "react";
import { useOrgDetailContext } from "../contexts";

export default function Index({ data }) {
	console.log("ServerSideProps:: Org=", data);

	const { setOrgDetail } = useOrgDetailContext();
	useEffect(() => {
		setOrgDetail(data);
	}, [data]);

	return <LoginPanel />;
}

export async function getServerSideProps({ req }) {
	// Get org details (like, logo, name, etc) from server
	return await fetchOrgDetails(req.headers.host);
}
