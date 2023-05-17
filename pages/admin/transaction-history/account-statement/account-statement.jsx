import { BreadcrumbsWrapper, PaddingBox } from "components";
import { TransactionHistoryObject } from "constants";
import Head from "next/head";
import { AccountStatement } from "page-components/Admin";

const AccountStatementPage = () => {
	return (
		<>
			<Head>
				<title>Account Statement</title>
			</Head>
			<PaddingBox>
				<BreadcrumbsWrapper
					BreadcrumbsObject={TransactionHistoryObject}
				>
					<AccountStatement />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
};

export default AccountStatementPage;
