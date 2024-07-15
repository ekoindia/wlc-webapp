import { fetchOrgDetails } from "helpers/fetchOrgDetailsHelper";
import { LayoutLogin } from "layout-components";

/**
 * Secret route to clear the Next.js server-side org cache
 * @param root0
 * @param root0.app_name
 */
export default function ClearOrgCache({ app_name }) {
	return <div>Cache cleared for {app_name}</div>;
}

// Custom layout for the Login page...
ClearOrgCache.getLayout = (page) => <LayoutLogin>{page}</LayoutLogin>;

/**
 *
 * @param root0
 * @param root0.req
 */
export async function getServerSideProps({ req }) {
	// Get org details (like, logo, name, etc) from server
	const org_details = await fetchOrgDetails(req.headers.host, true);
	return { props: { app_name: org_details?.app_name || "" } };
}
