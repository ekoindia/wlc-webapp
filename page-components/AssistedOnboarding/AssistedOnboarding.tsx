import { OnboardingWidget } from "components";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";

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
	// MARK: JSX
	return (
		<OnboardingWidget
			isAssistedOnboarding
			logo={logo}
			appName={app_name}
			orgName={org_name}
			userData={userData}
			updateUserInfo={updateUserInfo}
		/>
	);
};

export default AssistedOnboarding;
