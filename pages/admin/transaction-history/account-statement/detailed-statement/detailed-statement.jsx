import { BreadcrumbsWrapper, PaddingBox } from "components";
import { TransactionHistoryObject } from "constants";
import Head from "next/head";
import { DetailedStatement } from "page-components/Admin";

const DetailedStatementPage = () => {
	return (
		<>
			<Head>
				<title>Detailed Statement</title>
			</Head>
			<PaddingBox>
				<BreadcrumbsWrapper
					BreadcrumbsObject={TransactionHistoryObject}
				>
					<DetailedStatement />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
};

export default DetailedStatementPage;
