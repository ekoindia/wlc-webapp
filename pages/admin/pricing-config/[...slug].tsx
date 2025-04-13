import { BreadcrumbWrapper, PaddingBox } from "components";
import { PricingConfigBreadcrumbs } from "constants";
import { useRouter } from "next/router";
import { PricingConfig, PricingConfigProvider } from "page-components/Admin";

const PricingConfigPage = () => {
	const router = useRouter();
	const { slug } = router.query;
	const pathArray = Array.isArray(slug) ? slug : null;

	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={PricingConfigBreadcrumbs}
				slug={slug}
			>
				<PricingConfigProvider>
					<PricingConfig pathArray={pathArray} />
				</PricingConfigProvider>
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

// If the "subPage" property is set, then this page will hide the top app header in mobile view.
// Pages can show their own header bar with back button.
PricingConfigPage.pageMeta = {
	title: "Pricing Config",
	isSubPage: false,
};

// Use a diferent layout, if needed...
// First, import the alternate layout: import { LayoutLogin } from "layout-components";
// PricingConfigPage.getLayout = LayoutLogin;

export default PricingConfigPage;
