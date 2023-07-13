import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";
import { UpdateSellerAddress } from "page-components/Admin";

function UpdateSellerAddressPage() {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<UpdateSellerAddress />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
}

UpdateSellerAddressPage.pageMeta = {
	title: "My Network > Update Retailer Address | Admin",
	isSubPage: true,
};

export default UpdateSellerAddressPage;
