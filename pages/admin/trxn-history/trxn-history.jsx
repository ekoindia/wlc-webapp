import { Layout, TransactionHistory } from "components";
import Head from "next/head";
import React from "react";

const TrxnHistory = () => {
	return (
		<>
			<Head>
				<title>Trxn-History | Eko API Marketplace</title>
			</Head>

			<Layout>
				<TransactionHistory />
			</Layout>
		</>
	);
};

export default TrxnHistory;
