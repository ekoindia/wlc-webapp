import { Center, Spinner } from "@chakra-ui/react";
import { OnboardingWidget } from "components/OnboardingWidget";
import { Endpoints } from "constants/EndPoints";
import { useOrgDetailContext, useSession } from "contexts";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";

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
	agentDetails: initialAgentDetails,
	fetchAgentDetails: fetchAgentDetailsProp,
}: AgentOnboardingProps) => {
	const { userData, updateUserInfo } = useUser();
	console.log("[AgentOnboarding] userData", userData);
	const { orgDetail } = useOrgDetailContext();
	const { logo, app_name, org_name } = orgDetail ?? {};
	const [agentDetails, setAgentDetails] = useState(initialAgentDetails ?? {});
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const { accessToken } = useSession();

	console.log("[AgentOnboarding] userData", userData);
	console.log("[AgentOnboarding] initialAgentDetails", initialAgentDetails);

	/**
	 * Wrapper function to fetch agent details
	 * Uses passed prop function if available, otherwise falls back to local implementation
	 * @returns {Promise<any>} The agent details response
	 */
	const fetchAgentDetails = async (): Promise<any> => {
		// If fetchAgentDetails passed from parent, use it
		if (fetchAgentDetailsProp && agentMobile) {
			const details = await fetchAgentDetailsProp(agentMobile);
			setAgentDetails(details);
			return details;
		}

		// Fallback to local fetch if not provided
		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					method: "POST",
					body: {
						interaction_type_id: 151,
						csp_id: agentMobile,
						user_identity_type: "mobile_number",
						user_identity: userData?.userId,
						mobile: userData?.userId,
						id_type: "Mobile",
					},
					token: accessToken,
				}
			);

			if (response?.data) {
				console.log(
					"[AgentOnboarding] Agent details fetched:",
					response.data
				);
				setAgentDetails(response.data);
				return response.data;
			}
			return null;
		} catch (error) {
			console.error(
				"[AgentOnboarding] Error fetching agent details:",
				error
			);
			throw error;
		}
	};

	// call api for creating partial account (521)
	const createPartialAccount = async (): Promise<any> => {
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
				return response.data;
			} else {
				console.error(
					"[AgentOnboarding] No data in response:",
					response
				);
				return null;
			}
		} catch (error) {
			console.error(
				"[AgentOnboarding] Error creating partial account:",
				error
			);
			throw error;
		}
	};

	/**
	 * Initializes agent onboarding flow
	 * If agent details are pre-fetched, only creates partial account
	 * Otherwise, creates account and fetches details
	 */
	const initializeAgentOnboarding = async () => {
		setIsLoading(true);
		setHasError(false);

		try {
			// If agent details already provided, skip fetching
			if (initialAgentDetails) {
				console.log(
					"[AgentOnboarding] Using pre-fetched agent details, only creating partial account..."
				);
				await createPartialAccount();
				setIsLoading(false);
				return;
			}

			// Otherwise, perform full initialization
			console.log("[AgentOnboarding] Starting sequential API calls...");

			// Step 1: Create partial account
			await createPartialAccount();

			// Step 2: Wait for 1 second before calling next API
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Step 3: Fetch agent details AFTER the delay
			await fetchAgentDetails();

			setIsLoading(false);
		} catch (error) {
			console.error(
				"[AgentOnboarding] Error in sequential API calls:",
				error
			);
			setHasError(true);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		initializeAgentOnboarding();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// MARK: JSX
	if (isLoading) {
		return (
			<Center>
				<Spinner size="md" />
			</Center>
		);
	}

	if (hasError) {
		return <div>Error loading agent onboarding. Please try again.</div>;
	}

	return (
		<OnboardingWidget
			logo={logo}
			appName={app_name}
			orgName={org_name}
			userData={userData}
			updateUserInfo={updateUserInfo}
			isAssistedOnboarding={true}
			assistedAgentDetails={agentDetails}
			allowedMerchantTypes={[1]} // Restrict to Retailer role only
			refreshAgentProfile={fetchAgentDetails}
		/>
	);
};

export default AgentOnboarding;
