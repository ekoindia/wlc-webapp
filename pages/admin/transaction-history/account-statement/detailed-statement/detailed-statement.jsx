import { BreadcrumbsWrapper, PaddingBox } from "components";
import { TransactionHistoryBreadcrumbs } from "constants";
import { DetailedStatement } from "page-components/Admin";

const DetailedStatementPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={TransactionHistoryBreadcrumbs}>
				<DetailedStatement />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

DetailedStatementPage.pageMeta = {
	title: "Detailed Statement | Admin",
	isSubPage: true,
};

export default DetailedStatementPage;
