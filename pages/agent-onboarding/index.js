import { PaddingBox } from "components";
import { AssistedOnboarding } from "page-components";

const AgentOnboardingPage = () => {
	return (
		<PaddingBox>
			<AssistedOnboarding />
		</PaddingBox>
	);
};

// If the "subPage" property is set, then this page will hide the top app header in mobile view.
// Pages can show their own header bar with back button.
AgentOnboardingPage.pageMeta = {
	title: "Agent Onboarding",
	isSubPage: false,
};

// Use a diferent layout, if needed...
// First, import the alternate layout: import { LayoutLogin } from "layout-components";
// AgentOnboardingPage.getLayout = LayoutLogin;

export default AgentOnboardingPage;
