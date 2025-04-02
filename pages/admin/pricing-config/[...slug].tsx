import { PaddingBox } from "components";
import { useRouter } from "next/router";
import { PricingConfig } from "page-components/Admin";

const PricingConfigPage = () => {
	const router = useRouter();
	const { slug } = router.query; // Extract dynamic slug
	const pathArray = Array.isArray(slug) ? slug : [slug]; // Ensure it's an array

	return (
		<PaddingBox>
			<PricingConfig pathArray={pathArray} />
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
