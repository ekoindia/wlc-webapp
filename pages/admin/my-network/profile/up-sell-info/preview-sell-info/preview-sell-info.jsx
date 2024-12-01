import { BreadcrumbsWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { PreviewSellerInfo } from "page-components/Admin/UpdateSellerInfo";

/**
 *
 */
function PreviewSellerInfoPage() {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<PreviewSellerInfo />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
}

PreviewSellerInfoPage.pageMeta = {
	title: "My Network > Preview Retailer Info | Admin",
	isSubPage: true,
};

export default PreviewSellerInfoPage;
