import { LoginPanel } from "page-components";

/**
 * The Login page as index. Currently being used as the login page.
 */
export default function LoginPage(/* { data } */) {
	// console.log("ServerSideProps:: Org=", data);
	// const { setOrgDetail } = useOrgDetailContext();
	// useEffect(() => {
	// 	setOrgDetail(data);
	// }, [data]);

	return <LoginPanel />;
}

LoginPage.pageMeta = {
	title: "Welcome",
};

// export async function getServerSideProps({ req }) {
// 	const org_details = await fetchOrgDetails(req.headers.host);
// 	return org_details;
// }
