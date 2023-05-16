import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";
import Head from "next/head";
import { Network } from "page-components/Admin";

const MyNetwork = () => {
	return (
		<>
			<Head>
				<title>My Network</title>
			</Head>
			<PaddingBox>
				<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
					<Network />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
};

export default MyNetwork;
