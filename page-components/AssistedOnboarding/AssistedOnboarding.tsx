import { OnboardingWidget } from "components";
import { createRoleSelectionStep } from "constants/OnboardingSteps";
import { UserType } from "constants/UserTypes";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";

// Define agent types for assisted onboarding (only merchant/retailer)
const forAgentTypes = [UserType.MERCHANT];

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
	const { userData, updateUserInfo } = useUser();
	console.log("[AssistedOnboarding] userData", userData);
	const { orgDetail } = useOrgDetailContext();
	const { logo, app_name, org_name } = orgDetail ?? {};

	const assistedOnboardingRoleStep = createRoleSelectionStep(forAgentTypes);

	// MARK: JSX
	return (
		<OnboardingWidget
			isAssistedOnboarding
			logo={logo}
			appName={app_name}
			orgName={org_name}
			userData={userData}
			updateUserInfo={updateUserInfo}
			roleSelectionStep={assistedOnboardingRoleStep}
		/>
	);
};

export default AssistedOnboarding;
