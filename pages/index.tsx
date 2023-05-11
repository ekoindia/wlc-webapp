/* eslint-disable react-hooks/exhaustive-deps */
// import { fetchOrgDetails } from "helpers/fetchOrgDetailsHelper";
import { LoginPanel } from "page-components";
// import { useEffect } from "react";
// import { useOrgDetailContext } from "../contexts";

/**
 * The index page. Currently being used as the login page.
 */
export default function Index(/* { data } */) {
	// console.log("ServerSideProps:: Org=", data);

	// const { setOrgDetail } = useOrgDetailContext();
	// useEffect(() => {
	// 	setOrgDetail(data);
	// }, [data]);

	return <LoginPanel />;
}

// export async function getServerSideProps({ req }) {
// 	// Get org details (like, logo, name, etc) from server
// 	const org_details = await fetchOrgDetails(req.headers.host);

// 	console.debug(
// 		"[pages/index] ServerSideProps:: ",
// 		JSON.stringify(
// 			{
// 				host: req.headers.host,
// 				org: org_details,
// 			},
// 			null,
// 			2
// 		)
// 	);

// 	return org_details;
// }
