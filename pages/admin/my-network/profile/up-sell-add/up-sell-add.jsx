import { BreadcrumbsWrapper, Layout } from "components";
import { NetworkObject } from "constants";
import { UpdateSellerAddress } from "page-components/Admin";

import React from "react";
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
