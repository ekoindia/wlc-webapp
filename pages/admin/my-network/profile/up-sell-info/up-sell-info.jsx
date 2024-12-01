import { BreadcrumbsWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { UpdateSellerInfo } from "page-components/Admin";

/**
 *
 */
function UpdateSellerInfoPage() {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<UpdateSellerInfo />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
}

UpdateSellerInfoPage.pageMeta = {
	title: "My Network > Update Retailer Info | Admin",
	isSubPage: true,
};

export default UpdateSellerInfoPage;
