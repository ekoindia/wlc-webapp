import { BreadcrumbWrapper, PaddingBox } from "components";
import { TransactionHistoryBreadcrumbs } from "constants";
import { AccountStatement } from "page-components/Admin";

const AccountStatementPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={TransactionHistoryBreadcrumbs}>
				<AccountStatement />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

AccountStatementPage.pageMeta = {
	title: "Account Statement | Admin",
};

export default AccountStatementPage;
