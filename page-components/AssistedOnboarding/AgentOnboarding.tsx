import { OnboardingWidget } from "components";
import { Endpoints } from "constants/EndPoints";
import { createRoleSelectionStep } from "constants/OnboardingSteps";
import { UserType } from "constants/UserTypes";
import { useSession } from "contexts";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";

// Define agent types for assisted onboarding (only merchant/retailer)
const visibleAgentTypes = [UserType.MERCHANT];

export interface AgentOnboardingProps {
	agentMobile?: string;
}

/**
 * An AgentOnboarding component for assisted onboarding of agents
 * Uses the OnboardingWidget with assisted onboarding specific configuration
 * @param {AgentOnboardingProps} props - Component props
 * @param {string} [props.agentMobile] - The agent's mobile number
 * @returns {JSX.Element} The rendered AgentOnboarding component
 * @example
 * ```tsx
 * <AgentOnboarding agentMobile="XXXXXXXXXX" />
 * ```
 */
const AgentOnboarding = ({ agentMobile }: AgentOnboardingProps) => {
	const [agentDetails, setAgentDetails] = useState({});
	console.log("[AgentOnboarding] agentDetails", agentDetails);
	console.log("[AgentOnboarding] agentMobile", agentMobile);
	const { userData, updateUserInfo } = useUser();
	const { accessToken } = useSession();

	console.log("[AgentOnboarding] userData", userData);
	const { orgDetail } = useOrgDetailContext();
	const { logo, app_name, org_name } = orgDetail ?? {};

	const agentOnboardingRoleStep = createRoleSelectionStep(visibleAgentTypes);

	// call api for getting agent details (151)
	const fetchAgentDetails = async () => {
		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					method: "POST",
					body: {
						interaction_type_id: 151,
						csp_id: agentMobile,
					},
					token: accessToken,
				}
			);

			if (response?.data) {
				console.log(
					"[AgentOnboarding] Agent details fetched:",
					response.data
				);

				// Update user info with fetched agent details
				setAgentDetails(response.data);
			}
		} catch (error) {
			console.error(
				"[AgentOnboarding] Error fetching agent details:",
				error
			);
		}
	};

	// call api for creating partial account (521)
	const createPartialAccount = async () => {
		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					method: "POST",
					body: {
						source: "WLC",
						interaction_type_id: 521,
						user_id: userData?.id,
						merchant_type: 1,
						applicant_type: 0,
						csp_id: agentMobile,
						client_ref_id: Date.now().toString(),
					},
					token: accessToken,
				}
			);

			if (response?.data) {
				console.log(
					"[AgentOnboarding] Partial account created:",
					response.data
				);

				// Call fetchAgentDetails after successful partial account creation
				await fetchAgentDetails();
			} else {
				console.error(
					"[AgentOnboarding] No data in response:",
					response
				);
			}
		} catch (error) {
			console.error(
				"[AgentOnboarding] Error creating partial account:",
				error
			);
		}
	};

	useEffect(() => {
		createPartialAccount();
	}, []);

	// MARK: JSX
	return (
		<OnboardingWidget
			isAssistedOnboarding
			logo={logo}
			appName={app_name}
			orgName={org_name}
			userData={userData}
			updateUserInfo={updateUserInfo}
			roleSelectionStep={agentOnboardingRoleStep}
		/>
	);
};

export default AgentOnboarding;
