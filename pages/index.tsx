/* eslint-disable react-hooks/exhaustive-deps */
import {
	dummyOrgDetails,
	fetchOrgDetails,
} from "helpers/fetchOrgDetailsHelper";
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
	let data = {};

	if (process.env.NEXT_PUBLIC_ENV === "development") {
		// Dummy data for development
		data = dummyOrgDetails();
	} else {
		// Get org details of the associated host from server
		data = await fetchOrgDetails(req.headers.host);
	}

	// data = await fetchOrgDetails("simple.cashere.co");

	return {
		props: {
			data: data || {},
		},
	};
}
