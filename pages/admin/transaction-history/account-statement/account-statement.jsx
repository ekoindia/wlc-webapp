import { BreadcrumbsWrapper, Layout } from "components";
import { AccountStatement } from "page-components/Admin";
import { TransactionHistoryObject } from "constants";

import React from "react";

const AccountStatementPage = () => {
	return (
		<div>
			<Layout>
				<BreadcrumbsWrapper
					BreadcrumbsObject={TransactionHistoryObject}
				>
					<AccountStatement />
				</BreadcrumbsWrapper>
			</Layout>
		</div>
	);
};

export default AccountStatementPage;
