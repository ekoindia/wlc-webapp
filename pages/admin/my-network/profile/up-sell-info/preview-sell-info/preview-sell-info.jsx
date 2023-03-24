import { BreadcrumbsWrapper, Layout } from "components";
import { NetworkObject } from "constants";
import { PreviewSellerInfo } from "page-components/Admin/UpdateSellerInfo";

import React from "react";

function previewPersonalInfo() {
	return (
		<Layout>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<PreviewSellerInfo />
			</BreadcrumbsWrapper>
		</Layout>
	);
}

export default previewPersonalInfo;
