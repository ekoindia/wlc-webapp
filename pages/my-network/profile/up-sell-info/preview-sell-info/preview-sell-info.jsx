import { BreadcrumbWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { PreviewSellerInfo } from "page-components/Admin/UpdateSellerInfo";

/**
 * Preview Seller Info page for My Network
 * @returns {JSX.Element} The page component
 */
function PreviewSellerInfoPage() {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<PreviewSellerInfo />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
}

PreviewSellerInfoPage.pageMeta = {
	title: "My Network > Preview Retailer Info",
};

export default PreviewSellerInfoPage;
