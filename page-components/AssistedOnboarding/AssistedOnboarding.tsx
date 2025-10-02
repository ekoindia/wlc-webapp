import { OnboardingWidget } from "components";

/**
 * An AssistedOnboarding component for assisted onboarding of agents
 * Uses the OnboardingWidget with assisted onboarding specific configuration
 * @returns {JSX.Element} The rendered AssistedOnboarding component
 * @example
 * ```tsx
 * <AssistedOnboarding />
 * ```
 */
const AssistedOnboarding = () => {
	// MARK: JSX
	return <OnboardingWidget isAssistedOnboarding={true} />;
};

export default AssistedOnboarding;
