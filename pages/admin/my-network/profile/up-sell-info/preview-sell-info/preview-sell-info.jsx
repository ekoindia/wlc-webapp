import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";
import Head from "next/head";
import { PreviewSellerInfo } from "page-components/Admin/UpdateSellerInfo";

function previewPersonalInfo() {
	return (
		<>
			<Head>
				<title>Preview Personal Information</title>
			</Head>
			<PaddingBox>
				<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
					<PreviewSellerInfo />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
}

export default previewPersonalInfo;
