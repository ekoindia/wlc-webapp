import { BreadcrumbsWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { UpdateSellerAddress } from "page-components/Admin";

/**
 *
 */
function UpdateSellerAddressPage() {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<UpdateSellerAddress />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
}

UpdateSellerAddressPage.pageMeta = {
	title: "My Network > Update Agent Address | Admin",
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default UpdateSellerAddressPage;
