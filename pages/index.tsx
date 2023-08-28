import { LayoutLogin } from "components/Layout";
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

// Custom layout for the Login page...
LoginPage.getLayout = (page, org) => (
	<LayoutLogin appName={org?.app_name || ""}>{page}</LayoutLogin>
);

// export async function getServerSideProps({ req }) {
// 	const org_details = await fetchOrgDetails(req.headers.host);
// 	return org_details;
// }
