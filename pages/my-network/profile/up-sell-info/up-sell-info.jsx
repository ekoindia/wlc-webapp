import { BreadcrumbWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { UpdateSellerInfo } from "page-components/Admin";

/**
 * Update Seller Info page for My Network
 * @returns {JSX.Element} The page component
 */
function UpdateSellerInfoPage() {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<UpdateSellerInfo />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
}

UpdateSellerInfoPage.pageMeta = {
	title: "My Network > Update Retailer Info",
};

export default UpdateSellerInfoPage;
