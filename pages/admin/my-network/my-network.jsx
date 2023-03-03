import { Layout } from "components";
import Head from "next/head";
import { Network } from "page-components/Admin";
import React from "react";

const MyNetwork = () => {
	return (
		<>
			<Head>
				<title>My-Network | Eko API Marketplace</title>
			</Head>
			<Layout>
				<Network />
			</Layout>
		</>
	);
};

export default MyNetwork;
