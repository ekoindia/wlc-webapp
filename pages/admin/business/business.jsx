import { BreadcrumbsWrapper, PaddingBox } from "components";
import {
	business_setting_categories,
	BusinessSettingsBreadcrumbs,
} from "constants";
import { ConfigPageCard } from "page-components/Admin";

/**
 * Show the Pricing & Commission page: grid of products to set pricing/commissions for.
 */
const BusinessPage = () => {
	// return null;

	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={BusinessSettingsBreadcrumbs}>
				<ConfigPageCard
					heading="Business Settings"
					configCategories={business_setting_categories}
				/>
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

BusinessPage.pageMeta = {
	title: "Business Settings",
};

export default BusinessPage;
