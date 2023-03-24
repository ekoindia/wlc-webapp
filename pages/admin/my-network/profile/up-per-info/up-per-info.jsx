import { BreadcrumbsWrapper, Layout } from "components";
import { NetworkObject } from "constants";
import { UpdatePersonalInfo } from "page-components/Admin";

import React from "react";

function updatePersonalInfo() {
	return (
		<Layout>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<UpdatePersonalInfo />
			</BreadcrumbsWrapper>
		</Layout>
	);
}

export default updatePersonalInfo;
