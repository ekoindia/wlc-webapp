import { Layout } from "components";
import Head from "next/head";
import { DetailedStatement } from "page-components/Admin";
import React from "react";

const detStatement = () => {
	return (
		<>
			<Head>
				<title>Detailed-Statement | Eko API Marketplace</title>
			</Head>
			<Layout>
				<DetailedStatement />
			</Layout>
		</>
	);
};

export default detStatement;
