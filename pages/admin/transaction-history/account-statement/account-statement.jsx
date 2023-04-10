import { BreadcrumbsWrapper, Layout } from "components";
import { TransactionHistoryObject } from "constants";
import { AccountStatement } from "page-components/Admin";

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
