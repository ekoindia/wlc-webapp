import { BreadcrumbsWrapper, PaddingBox } from "components";
import { TransactionHistoryBreadcrumbs } from "constants";
import { TransactionHistory } from "page-components/Admin";

const TransactionHistoryPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={TransactionHistoryBreadcrumbs}>
				<TransactionHistory />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

TransactionHistoryPage.pageMeta = {
	title: "Transaction History | Admin",
};

export default TransactionHistoryPage;
