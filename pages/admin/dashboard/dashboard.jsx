import { Layout } from "components";
import Head from "next/head";
import { Dashboard } from "page-components/Admin";
import React from "react";

const Dashboards = () => {
	return (
		<>
			<Head>
				<title>Dashboard | Eko API Marketplace</title>
			</Head>
			<Layout>
				<Dashboard />
			</Layout>
		</>
	);
};

export default Dashboards;
