import { BreadcrumbsWrapper, PaddingBox } from "components";
import { TransactionHistoryObject } from "constants";
import { DetailedStatement } from "page-components/Admin";

const DetailedStatementPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={TransactionHistoryObject}>
				<DetailedStatement />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

DetailedStatementPage.pageMeta = {
	title: "Detailed Statement | Admin",
	isSubPage: true,
	showBottomAppBar: true,
};

export default DetailedStatementPage;
