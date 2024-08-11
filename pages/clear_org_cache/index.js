import { Flex, Spinner } from "@chakra-ui/react";
import { fetchOrgDetails } from "helpers/fetchOrgDetailsHelper";

/**
 * Secret route to clear the Next.js server-side org cache
 * @returns {JSX.Element} The component displaying a centered spinner
 */
export default function ClearOrgCache() {
	return (
		<Flex w="full" h="full" justify="center" align="center">
			<Spinner />
		</Flex>
	);
}

/**
 * Fetches the organization details and provides them as props for the page
 * @param {object} context - The context object containing request information
 * @param {object} context.req - The HTTP request object
 * @returns {Promise<{props: {app_name: string}}>} The app name as a prop for the page
 */
export async function getServerSideProps({ req }) {
	// Get org details (like, logo, name, etc) from server
	const org_details = await fetchOrgDetails(req.headers.host, true);
	return { props: { app_name: org_details?.props?.data?.app_name || "" } };
}
