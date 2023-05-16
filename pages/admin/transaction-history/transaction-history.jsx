import { BreadcrumbsWrapper, PaddingBox } from "components";
import { TransactionHistoryObject } from "constants";
import Head from "next/head";
import { TransactionHistory } from "page-components/Admin";

const TransactionHistoryPage = () => {
	return (
		<>
			<Head>
				<title>Transaction History</title>
			</Head>

			<PaddingBox>
				<BreadcrumbsWrapper
					BreadcrumbsObject={TransactionHistoryObject}
				>
					<TransactionHistory />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
};

export default TransactionHistoryPage;
