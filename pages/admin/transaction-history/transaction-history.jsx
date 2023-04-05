import { BreadcrumbsWrapper, Layout } from "components";
import { TransactionHistoryObject } from "constants";
import Head from "next/head";
import { TransactionHistory } from "page-components/Admin";

const TransactionHistoryPage = () => {
	return (
		<>
			<Head>
				<title>Transaction History | Eko API Marketplace</title>
			</Head>

			<Layout>
				<BreadcrumbsWrapper
					BreadcrumbsObject={TransactionHistoryObject}
				>
					<TransactionHistory />
				</BreadcrumbsWrapper>
			</Layout>
		</>
	);
};

export default TransactionHistoryPage;
