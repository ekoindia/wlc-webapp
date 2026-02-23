import { useOrgDetailContext } from "contexts";
import { useUser } from "contexts/UserContext";
import { OnboardingWidget } from "../../components";

export interface AgentOnboardingProps {
	agentMobile?: string;
	agentDetails?: any;
	refreshAgentProfile?: () => Promise<void>;
}

/**
 * An AgentOnboarding component for assisted onboarding of agents
 * Uses the OnboardingWidget with assisted onboarding specific configuration.
 *
 * Note: The OnboardingProvider is already set up above in AssistedOnboarding,
 * so OnboardingSteps will skip wrapping with another provider.
 * @param {AgentOnboardingProps} props - Component props
 * @param {string} [props.agentMobile] - The agent's mobile number
 * @param {any} [props.agentDetails] - Pre-fetched agent details
 * @param {() => Promise<void>} [props.refreshAgentProfile] - Function to refresh agent profile data
 * @returns {JSX.Element} The rendered AgentOnboarding component
 */
const AgentOnboarding = ({
	agentMobile,
	agentDetails,
	refreshAgentProfile,
}: AgentOnboardingProps) => {
	const { userData } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { logo, app_name, org_name } = orgDetail ?? {};

	/**
	 * Enrich agentDetails to ensure mobile is always available.
	 * This is critical for RoleSelection to get the csp_id.
	 */
	const enrichedAgentDetails = {
		...agentDetails,
		user_detail: {
			...agentDetails?.user_detail,
			mobile: agentDetails?.user_detail?.mobile || agentMobile,
		},
	};

	return (
		<OnboardingWidget
			logo={logo}
			appName={app_name}
			orgName={org_name}
			userData={userData}
			updateUserInfo={() => {}}
			isAssistedOnboarding={true}
			assistedAgentDetails={enrichedAgentDetails}
			refreshAgentProfile={refreshAgentProfile || (async () => {})}
		/>
	);
};

export default AgentOnboarding;
