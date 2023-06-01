import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PricingCommissionObject } from "constants";
import { PricingCommission } from "page-components/Admin";

const Pricing = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={PricingCommissionObject}>
				<PricingCommission />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

Pricing.pageMeta = {
	title: "Pricing & Commission | Admin",
};

export default Pricing;
