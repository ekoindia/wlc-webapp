import { Layout } from "components";
import Head from "next/head";
import { PricingCommission } from "Page-components/Admin";
import React from "react";

const Pricing = () => {
	return (
		<>
			<Head>
				<title>Pricing | Eko API Marketplace</title>
			</Head>
			<Layout>
				<PricingCommission />
			</Layout>
		</>
	);
};

export default Pricing;
