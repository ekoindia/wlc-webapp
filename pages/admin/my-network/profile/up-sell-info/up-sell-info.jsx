import { BreadcrumbsWrapper, Layout, PaddingBox } from "components";
import { NetworkObject } from "constants";
import Head from "next/head";
import { UpdateSellerInfo } from "page-components/Admin";

function updateSellerInfo() {
	return (
		<>
			<Head>
				<title>Update Seller Information</title>
			</Head>
			<Layout>
				<PaddingBox>
					<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
						<UpdateSellerInfo />
					</BreadcrumbsWrapper>
				</PaddingBox>
			</Layout>
		</>
	);
}

export default updateSellerInfo;
