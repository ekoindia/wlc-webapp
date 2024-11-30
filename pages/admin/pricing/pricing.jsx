import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PricingCommissionObject } from "constants";
import { ConfigPageCard } from "page-components/Admin";

/**
 * Show the Pricing & Commission page: grid of products to set pricing/commissions for.
 */
const Pricing = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={PricingCommissionObject}>
				<ConfigPageCard />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

Pricing.pageMeta = {
	title: "Pricing & Commission | Admin",
};

export default Pricing;
