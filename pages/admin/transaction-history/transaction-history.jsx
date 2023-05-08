import { BreadcrumbsWrapper, Layout, PaddingBox } from "components";
import { TransactionHistoryObject } from "constants";
import Head from "next/head";
import { TransactionHistory } from "page-components/Admin";

const TransactionHistoryPage = () => {
	return (
		<>
			<Head>
				<title>Transaction History</title>
			</Head>

			<Layout>
				<PaddingBox>
					<BreadcrumbsWrapper
						BreadcrumbsObject={TransactionHistoryObject}
					>
						<TransactionHistory />
					</BreadcrumbsWrapper>
				</PaddingBox>
			</Layout>
		</>
	);
};

export default TransactionHistoryPage;
