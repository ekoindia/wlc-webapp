import { Layout } from "components";
import Head from "next/head";
import { TransactionHistory } from "page-components/Admin";
import React from "react";

const TransactionHistoryPage = () => {
	return (
		<>
			<Head>
				<title>Transaction History | Eko API Marketplace</title>
			</Head>

			<Layout>
				<TransactionHistory />
			</Layout>
		</>
	);
};

export default TransactionHistoryPage;
