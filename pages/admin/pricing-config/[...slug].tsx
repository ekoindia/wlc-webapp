import { BreadcrumbWrapper, PaddingBox } from "components";
import { useRouter } from "next/router";
import { PricingConfig, PricingConfigProvider } from "page-components/Admin";
import { generateBreadcrumbs } from "utils/breadcrumbUtils";

const labelOverrides = {
	"agent-pricing": "Agent's Pricing",
	"distributor-commission": "Distributor's Commission",
	"pricing-config": "Pricing & Commission",
};

const PricingConfigPage = () => {
	const { asPath, query } = useRouter();
	const { slug } = query;
	const pathArray = Array.isArray(slug) ? slug : null;
	const crumbs = generateBreadcrumbs(asPath, labelOverrides, ["/admin"]);

	return (
		<PaddingBox>
			<BreadcrumbWrapper crumbs={crumbs}>
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
