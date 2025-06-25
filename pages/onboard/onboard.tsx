import { BreadcrumbWrapper, PaddingBox } from "components";
import { OnboardAgents } from "page-components/Admin";

const OnboardPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/onboard": "Onboard Vendor",
				}}
			>
				<OnboardAgents />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

// If the "subPage" property is set, then this page will hide the top app header in mobile view.
// Pages can show their own header bar with back button.
OnboardPage.pageMeta = {
	title: "Onboard",
	isFixedBottomAppBar: true,
};

// Use a diferent layout, if needed...
// First, import the alternate layout: import { LayoutLogin } from "layout-components";
// Onboard.getLayout = LayoutLogin;

export default OnboardPage;
