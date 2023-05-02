import { BreadcrumbsWrapper, Layout } from "components";
import { PricingCommissionObject } from "constants";

import Head from "next/head";
import { PricingCommission } from "page-components/Admin";

const Pricing = () => {
	return (
		<>
			<Head>
				<title>Pricing | Eko API Marketplace</title>
			</Head>
			<Layout>
				<BreadcrumbsWrapper BreadcrumbsObject={PricingCommissionObject}>
					<PricingCommission />
				</BreadcrumbsWrapper>
			</Layout>
		</>
	);
};

export default Pricing;
