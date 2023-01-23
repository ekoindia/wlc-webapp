import React from "react";
import Head from "next/head";
import { DetailedStatement, Layout } from "components";

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
