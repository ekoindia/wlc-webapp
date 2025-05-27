import { BreadcrumbWrapper, PaddingBox } from "components";
import {
	PricingCommissionBreadcrumbs,
	product_pricing_categories,
} from "constants";
import { ConfigPageCard } from "page-components/Admin";
import { DownloadPricing } from "page-components/Admin/PricingCommission/DownloadPricing";

/**
 * Show the Pricing & Commission page: grid of products to set pricing/commissions for.
 */
const PricingPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={PricingCommissionBreadcrumbs}>
				<ConfigPageCard
					heading="Pricing & Commissions"
					configCategories={product_pricing_categories}
					HeaderTool={<DownloadPricing />}
				/>
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

PricingPage.pageMeta = {
	title: "PricingPage & Commission | Admin",
};

export default PricingPage;
