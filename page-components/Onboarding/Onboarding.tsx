import { OnboardingWidget } from "components";
import { createRoleSelectionStep } from "constants/OnboardingSteps";
import { UserType } from "constants/UserTypes";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";

// Define agent types for regular onboarding
const forAgentTypes = [UserType.I_MERCHANT, UserType.DISTRIBUTOR];

/**
 * An Onboarding component for onboarding of agents
 * Uses the OnboardingWidget with onboarding specific configuration
 * @returns {JSX.Element} The rendered Onboarding component
 * @example
 * ```tsx
 * <Onboarding />
 * ```
 */
const Onboarding = () => {
	const { userData, updateUserInfo } = useUser();
	console.log("[Onboarding] userData", userData);
	const { orgDetail } = useOrgDetailContext();
	const { logo, app_name, org_name } = orgDetail ?? {};

	// Example: Custom user type labels from org_metadata (in the future from orgDetail)
	// const customUserTypeLabels = orgDetail?.user_type_labels || {};
	// const customUserTypeLabels = {
	// 	1: "Partner", // Custom label for Distributor
	// 	3: "Agent", // Custom label for I_MERCHANT
	// 	23: "API Partner", // Custom label for Enterprise
	// };

	// const onboardingRoleStep = createRoleSelectionStep(forAgentTypes, {
	// 	userTypeLabels: customUserTypeLabels,
	// });

	const onboardingRoleStep = createRoleSelectionStep(forAgentTypes);

	// MARK: JSX
	return (
		<OnboardingWidget
			logo={logo}
			appName={app_name}
			orgName={org_name}
			userData={userData}
			updateUserInfo={updateUserInfo}
			roleSelectionStep={onboardingRoleStep}
		/>
	);
};

export default Onboarding;
