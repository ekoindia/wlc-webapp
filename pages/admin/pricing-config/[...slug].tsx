import { PaddingBox } from "components";
import { useRouter } from "next/router";
import { PricingConfig, PricingConfigProvider } from "page-components/Admin";

const PricingConfigPage = () => {
	const { query } = useRouter();
	const { slug } = query;
	const pathArray: string[] | null = Array.isArray(slug) ? slug : null;

	return (
		<PaddingBox>
			<PricingConfigProvider>
				<PricingConfig pathArray={pathArray} />
			</PricingConfigProvider>
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
