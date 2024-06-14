import { LayoutLogin } from "layout-components";
import { LandingPanel } from "page-components";

/**
 * The Landing Page as index. Currently being used as the login page.
 */
export default function LandingPage(/* { data } */) {
	// console.log("ServerSideProps:: Org=", data);
	// const { setOrgDetail } = useOrgDetailContext();
	// useEffect(() => {
	// 	setOrgDetail(data);
	// }, [data]);

	// return <LoginPanel />;
	return <LandingPanel />;
}

// Custom layout for the Login page...
LandingPage.getLayout = (page, org) => (
	<LayoutLogin appName={org?.app_name || ""}>{page}</LayoutLogin>
);

// export async function getServerSideProps({ req }) {
// 	const org_details = await fetchOrgDetails(req.headers.host);
// 	return org_details;
// }
