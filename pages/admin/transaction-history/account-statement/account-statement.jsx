import { BreadcrumbsWrapper, PaddingBox } from "components";
import { TransactionHistoryBreadcrumbs } from "constants";
import { AccountStatement } from "page-components/Admin";

const AccountStatementPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={TransactionHistoryBreadcrumbs}>
				<AccountStatement />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

AccountStatementPage.pageMeta = {
	title: "Account Statement | Admin",
	isSubPage: true,
};

export default AccountStatementPage;
