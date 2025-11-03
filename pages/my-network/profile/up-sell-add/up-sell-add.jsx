import { BreadcrumbWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { UpdateSellerAddress } from "page-components/Admin";

/**
 * Update Seller Address page for My Network
 * @returns {JSX.Element} The page component
 */
function UpdateSellerAddressPage() {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<UpdateSellerAddress />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
}

UpdateSellerAddressPage.pageMeta = {
	title: "My Network > Update Agent Address",
	isFixedBottomAppBar: true,
};

export default UpdateSellerAddressPage;
