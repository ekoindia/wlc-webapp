import { BreadcrumbsWrapper, PaddingBox } from "components";
import { TransactionHistoryObject } from "constants";
import { AccountStatement } from "page-components/Admin";

const AccountStatementPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={TransactionHistoryObject}>
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
