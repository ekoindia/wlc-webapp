import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";
import Head from "next/head";
import { UpdateSellerInfo } from "page-components/Admin";

function updateSellerInfo() {
	return (
		<>
			<Head>
				<title>Update Seller Information</title>
			</Head>
			<PaddingBox>
				<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
					<UpdateSellerInfo />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
}

export default updateSellerInfo;
