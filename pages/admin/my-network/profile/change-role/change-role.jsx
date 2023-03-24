import { BreadcrumbsWrapper, Layout } from "components";
import { NetworkObject } from "constants";

import { ChangeRole } from "page-components/Admin";
import React from "react";

const changeRole = () => {
	return (
		<Layout>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<ChangeRole />
			</BreadcrumbsWrapper>
		</Layout>
	);
};

export default changeRole;
