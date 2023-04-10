import { BreadcrumbsWrapper, Layout } from "components";
import { NetworkObject } from "constants";
import { UpdateSellerInfo } from "page-components/Admin";

function updateSellerInfo() {
	return (
		<Layout>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<UpdateSellerInfo />
			</BreadcrumbsWrapper>
		</Layout>
	);
}

export default updateSellerInfo;
