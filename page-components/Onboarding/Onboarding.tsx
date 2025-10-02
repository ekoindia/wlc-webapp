import { OnboardingWidget } from "components";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";

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
	// MARK: JSX
	return (
		<OnboardingWidget
			logo={logo}
			appName={app_name}
			orgName={org_name}
			userData={userData}
			updateUserInfo={updateUserInfo}
		/>
	);
};

export default Onboarding;
