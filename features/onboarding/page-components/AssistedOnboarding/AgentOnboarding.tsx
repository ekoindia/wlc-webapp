import { useOrgDetailContext } from "contexts";
import { useUser } from "contexts/UserContext";
import { useCallback, useState } from "react";
import { OnboardingWidget } from "../../components";

export interface AgentOnboardingProps {
	agentMobile?: string;
	agentDetails?: any;
	fetchAgentDetails?: (_mobile: string) => Promise<any>;
}

/**
 * An AgentOnboarding component for assisted onboarding of agents
 * Uses the OnboardingWidget with assisted onboarding specific configuration
 * @param {AgentOnboardingProps} props - Component props
 * @param {string} [props.agentMobile] - The agent's mobile number
 * @param {any} [props.agentDetails] - Pre-fetched agent details to avoid redundant API calls
 * @param {(mobile: string) => Promise<any>} [props.fetchAgentDetails] - Function to fetch agent details from API
 * @returns {JSX.Element} The rendered AgentOnboarding component
 * @example
 * ```tsx
 * <AgentOnboarding agentMobile="XXXXXXXXXX" agentDetails={details} fetchAgentDetails={fetchAgentDetails} />
 * ```
 */
const AgentOnboarding = ({
	agentMobile,
	agentDetails: assistedAgentDetailsProp,
	fetchAgentDetails,
}: AgentOnboardingProps) => {
	const { userData } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { logo, app_name, org_name } = orgDetail ?? {};

	// Local state to track agent details — updated when refreshAgentProfile fetches new data
	const [localAgentDetails, setLocalAgentDetails] = useState<any>(null);

	// Use local state if available (post-refresh), otherwise fall back to prop
	const agentDetails = localAgentDetails || assistedAgentDetailsProp;

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

	/**
	 * Refresh agent profile and capture the updated data locally.
	 * For new agents (no partial account yet), the fetch is expected to fail —
	 * this is handled gracefully so OnboardingWidget can proceed to ROLE_SELECTION.
	 */
	const refreshAgentProfile = useCallback(async () => {
		const mobile = agentMobile || agentDetails?.user_detail?.mobile;
		if (fetchAgentDetails && mobile) {
			try {
				const details = await fetchAgentDetails(mobile);
				if (details) {
					setLocalAgentDetails(details);
				}
			} catch (error) {
				// Expected for new agents — profile doesn't exist until partial account is created
				console.log(
					"[AgentOnboarding] Profile not found (expected for new agents)",
					error
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agentMobile, fetchAgentDetails]);

	return (
		<OnboardingWidget
			logo={logo}
			appName={app_name}
			orgName={org_name}
			userData={userData}
			updateUserInfo={() => {}}
			isAssistedOnboarding={true}
			assistedAgentDetails={enrichedAgentDetails}
			refreshAgentProfile={refreshAgentProfile}
		/>
	);
};

export default AgentOnboarding;
