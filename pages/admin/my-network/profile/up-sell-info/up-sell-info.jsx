import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";
import { UpdateSellerInfo } from "page-components/Admin";

function UpdateSellerInfoPage() {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
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
