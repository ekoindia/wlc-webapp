import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";
import { PreviewSellerInfo } from "page-components/Admin/UpdateSellerInfo";

function PreviewSellerInfoPage() {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<PreviewSellerInfo />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
}

PreviewSellerInfoPage.pageMeta = {
	title: "My Network > Preview Seller Info | Admin",
	isSubPage: true,
};

export default PreviewSellerInfoPage;
