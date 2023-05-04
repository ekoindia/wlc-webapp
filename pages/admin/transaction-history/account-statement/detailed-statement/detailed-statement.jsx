import { BreadcrumbsWrapper, Layout, PaddingBox } from "components";
import { TransactionHistoryObject } from "constants";
import Head from "next/head";
import { DetailedStatement } from "page-components/Admin";

const DetailedStatementPage = () => {
	return (
		<>
			<Head>
				<title>Detailed Statement</title>
			</Head>
			<Layout>
				<PaddingBox>
					<BreadcrumbsWrapper
						BreadcrumbsObject={TransactionHistoryObject}
					>
						<DetailedStatement />
					</BreadcrumbsWrapper>
				</PaddingBox>
			</Layout>
		</>
	);
};

export default DetailedStatementPage;
