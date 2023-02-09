import { Layout, PricingCommissions } from "components";
import Head from "next/head";
import React from "react";

const Pricing = () => {
	return (
		<>
			<Head>
				<title>Pricing | Eko API Marketplace</title>
			</Head>
			<Layout>
				<PricingCommissions />
			</Layout>
		</>
	);
};

export default Pricing;
