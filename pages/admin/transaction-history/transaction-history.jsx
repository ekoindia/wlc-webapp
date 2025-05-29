import { BreadcrumbWrapper, PaddingBox } from "components";
import { TransactionHistoryBreadcrumbs } from "constants";
import { TransactionHistory } from "page-components/Admin";

const TransactionHistoryPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={TransactionHistoryBreadcrumbs}>
				<TransactionHistory />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

TransactionHistoryPage.pageMeta = {
	title: "Transaction History | Admin",
};

export default TransactionHistoryPage;
