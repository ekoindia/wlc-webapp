import { AssistedOnboarding } from "page-components";

/**
 * An AgentOnboarding page for agent onboarding
 * Uses the Onboarding component with assisted onboarding specific configuration
 * @returns {JSX.Element} The rendered AgentOnboarding component
 * @example
 * ```tsx
 * <AgentOnboarding />
 * ```
 */
const AgentOnboardingPage = () => {
	return <AssistedOnboarding />;
};

AgentOnboardingPage.pageMeta = {
	title: "Agent Onboarding",
	isSubPage: false,
};

export default AgentOnboardingPage;
