import { BreadcrumbsWrapper, Layout, PaddingBox } from "components";
import { NetworkObject } from "constants";
import Head from "next/head";
import { UpdateSellerAddress } from "page-components/Admin";

function upSellAdd() {
	return (
		<>
			<Head>
				<title>Update Seller Address</title>
			</Head>
			<Layout>
				<PaddingBox>
					<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
						<UpdateSellerAddress />
					</BreadcrumbsWrapper>
				</PaddingBox>
			</Layout>
		</>
	);
}

export default upSellAdd;
