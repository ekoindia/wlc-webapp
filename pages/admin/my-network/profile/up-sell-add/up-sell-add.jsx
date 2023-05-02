import { BreadcrumbsWrapper, Layout } from "components";
import { NetworkObject } from "constants";
import { UpdateSellerAddress } from "page-components/Admin";

function upSellAdd() {
	return (
		<Layout>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<UpdateSellerAddress />
			</BreadcrumbsWrapper>
		</Layout>
	);
}

export default upSellAdd;
