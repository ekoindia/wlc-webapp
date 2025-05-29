import { BreadcrumbWrapper, PaddingBox } from "components";
import { TransactionHistoryBreadcrumbs } from "constants";
import { DetailedStatement } from "page-components/Admin";

const DetailedStatementPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={TransactionHistoryBreadcrumbs}>
				<DetailedStatement />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

DetailedStatementPage.pageMeta = {
	title: "Detailed Statement | Admin",
};

export default DetailedStatementPage;
