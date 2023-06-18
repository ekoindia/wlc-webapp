import { LoginPanel } from "page-components";

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
// 	const org_details = await fetchOrgDetails(req.headers.host);
// 	return org_details;
// }
