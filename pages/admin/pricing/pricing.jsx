import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PricingCommissionObject } from "constants";
import Head from "next/head";
import { PricingCommission } from "page-components/Admin";

const Pricing = () => {
	return (
		<>
			<Head>
				<title>Pricing & Comission</title>
			</Head>
			<PaddingBox>
				<BreadcrumbsWrapper BreadcrumbsObject={PricingCommissionObject}>
					<PricingCommission />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
};

export default Pricing;
