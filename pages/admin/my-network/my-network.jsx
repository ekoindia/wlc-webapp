import { BreadcrumbsWrapper, Layout, PaddingBox } from "components";
import { NetworkObject } from "constants";
import Head from "next/head";
import { Network } from "page-components/Admin";

const MyNetwork = () => {
	return (
		<>
			<Head>
				<title>My Network</title>
			</Head>
			<Layout>
				<PaddingBox>
					<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
						<Network />
					</BreadcrumbsWrapper>
				</PaddingBox>
			</Layout>
		</>
	);
};

export default MyNetwork;
