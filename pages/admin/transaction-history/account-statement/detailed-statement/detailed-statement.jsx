import { BreadcrumbsWrapper, Layout } from "components";
import { TransactionHistoryObject } from "constants";
import Head from "next/head";
import { DetailedStatement } from "page-components/Admin";

const DetailedStatementPage = () => {
	return (
		<>
			<Head>
				<title>Detailed-Statement | Eko API Marketplace</title>
			</Head>
			<Layout>
				<BreadcrumbsWrapper
					BreadcrumbsObject={TransactionHistoryObject}
				>
					<DetailedStatement />
				</BreadcrumbsWrapper>
			</Layout>
		</>
	);
};

export default DetailedStatementPage;
