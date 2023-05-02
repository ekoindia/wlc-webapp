import { BreadcrumbsWrapper, Layout } from "components";
import { NetworkObject } from "constants";
import Head from "next/head";
import { Network } from "page-components/Admin";

const MyNetwork = () => {
	return (
		<>
			<Head>
				<title>My-Network | Eko API Marketplace</title>
			</Head>
			<Layout>
				<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
					<Network />
				</BreadcrumbsWrapper>
			</Layout>
		</>
	);
};

export default MyNetwork;
