import { BreadcrumbsWrapper, PaddingBox } from "components";
import { TransactionHistoryObject } from "constants";
import { TransactionHistory } from "page-components/Admin";

const TransactionHistoryPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={TransactionHistoryObject}>
				<TransactionHistory />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

TransactionHistoryPage.pageMeta = {
	title: "Transaction History | Admin",
};

export default TransactionHistoryPage;
