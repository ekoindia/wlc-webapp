import { Flex } from "@chakra-ui/react";
import { PageTitle } from "components/PageTitle";
import { Endpoints } from "constants/EndPoints";
import { useNetworkUsers, useSession } from "contexts";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import {
	AddAgentForm,
	type AgentAlreadyExistsScreenProps,
	type AgentOnboardingProps,
	type OnboardingCompletedProps,
	type OtpVerificationFormProps,
} from ".";
import { OnboardingProvider } from "../../context";
import {
	getAgreementIdFromData,
	getOnboardingStepsFromData,
	getRoleListFromData,
	getUserNameFromData,
	getUserTypeFromData,
} from "../../utils";

/**
 * Constants representing the different steps in the assisted onboarding flow
 */
export const ASSISTED_ONBOARDING_STEPS = {
	ADD_AGENT: "ADD_AGENT",
	AGENT_STATUS_CHECK: "AGENT_STATUS_CHECK",
	AGENT_ALREADY_EXISTS: "AGENT_ALREADY_EXISTS",
	OTP_VERIFICATION: "OTP_VERIFICATION",
	ONBOARDING_WIDGET: "ONBOARDING_WIDGET",
	ONBOARDING_COMPLETED: "ONBOARDING_COMPLETED",
} as const;

const stepBasedTitleMap: Record<
	keyof typeof ASSISTED_ONBOARDING_STEPS,
	string
> = {
	ADD_AGENT: "Add Agent",
	AGENT_STATUS_CHECK: "Checking Agent Status",
	AGENT_ALREADY_EXISTS: "Agent Already Exists",
	OTP_VERIFICATION: "Verify OTP",
	ONBOARDING_WIDGET: "Agent Onboarding",
	ONBOARDING_COMPLETED: "Onboarding Completed",
};

/**
 * API Response type IDs for different scenarios
 */
export const RESPONSE_TYPE_IDS = {
	AGENT_COMPLETED_ONBOARDING: 874,
	AGENT_OTP_VERIFIED_PENDING_ONBOARDING: 862,
	AGENT_NOT_EXISTS_NEED_OTP: 873,
	OTP_VERIFICATION_SUCCESS: 876,
	OTP_VERIFICATION_ERROR: 302,
} as const;

const AgentStatusCheck = dynamic(() => import("./AgentStatusCheck"), {
	ssr: false,
});

const AgentAlreadyExistsScreen = dynamic(
	() => import("./AgentAlreadyExistsScreen"),
	{ ssr: false }
) as React.ComponentType<AgentAlreadyExistsScreenProps>;

const OtpVerificationForm = dynamic(() => import("./OtpVerificationForm"), {
	ssr: false,
}) as React.ComponentType<OtpVerificationFormProps>;

const AgentOnboarding = dynamic(() => import("./AgentOnboarding"), {
	ssr: false,
}) as React.ComponentType<AgentOnboardingProps>;

const OnboardingCompleted = dynamic(() => import("./OnboardingCompleted"), {
	ssr: false,
}) as React.ComponentType<OnboardingCompletedProps>;

/**
 * AssistedOnboarding component that manages the multi-step agent onboarding flow.
 *
 * This component wraps the entire assisted flow in an OnboardingProvider so that
 * every step (pre-KYC and KYC) has access to shared data (mobile, userName, etc.)
 * via useOnboardingContext().
 * @returns {JSX.Element} The rendered AssistedOnboarding component
 */
const AssistedOnboarding = (): JSX.Element => {
	const router = useRouter();
	const { userData } = useUser();
	const { accessToken } = useSession();
	const { refreshUserList } = useNetworkUsers();
	const { orgDetail } = useOrgDetailContext();

	const [step, setStep] = useState<keyof typeof ASSISTED_ONBOARDING_STEPS>(
		ASSISTED_ONBOARDING_STEPS.ADD_AGENT
	);
	const [agentMobile, setAgentMobile] = useState<string>("");
	const [agentDetails, setAgentDetails] = useState<any>(null);

	const isAdmin = userData?.userType === "Admin";

	/**
	 * Resets agent-specific state when starting a new onboarding flow.
	 * Called when "Onboard Another Agent" is clicked to prevent stale data
	 * from the previous agent leaking into the next onboarding.
	 */
	const resetAgentState = useCallback(() => {
		setAgentDetails(null);
		setAgentMobile("");
	}, []);

	/**
	 * Fetches agent details using the refresh-profile endpoint.
	 * Passes `csp_id` so the backend returns the agent's profile, not the admin's.
	 * NOTE: We intentionally do NOT call `updateUserInfo` here — the result is
	 * stored locally in `agentDetails` to avoid overwriting the admin's global state.
	 * @param {string} mobile - The agent's mobile number to fetch details for
	 * @returns {Promise<any>} The agent details response
	 */
	const fetchAgentDetails = async (mobile: string): Promise<any> => {
		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL +
					Endpoints.REFRESH_PROFILE,
				{
					body: {
						csp_id: mobile,
					},
					token: accessToken,
				}
			);

			if (response?.details) {
				let agentData = response;
				console.log(
					"[AssistedOnboarding] Agent details fetched:",
					agentData
				);

				// If onboarding is complete, move to the completed step
				if (agentData?.details?.onboarding === 0) {
					refreshUserList(true);
					setStep(ASSISTED_ONBOARDING_STEPS.ONBOARDING_COMPLETED);
					return;
				}

				// Map `details` → `userDetails` to match the shape that SelfOnboarding
				// produces via Redux. This allows data extractors to work without
				// any isAssistedOnboarding branching.
				agentData = {
					...agentData,
					userDetails: agentData.details,
					onboarding_steps: agentData.details.onboarding_steps,
					role_list: agentData.details.role_list,
				};

				return agentData;
			}
			return null;
		} catch (error) {
			console.error(
				"[AssistedOnboarding] Error fetching agent details:",
				error
			);
			throw error;
		}
	};

	/**
	 * Refresh agent profile by re-fetching agent details.
	 * Used by OnboardingProvider and passed to child components.
	 * Updates agentDetails state so the provider re-renders with fresh data.
	 */
	const refreshAgentProfile = useCallback(async () => {
		if (agentMobile) {
			try {
				const details = await fetchAgentDetails(agentMobile);
				if (details) {
					setAgentDetails(details);
				}
			} catch (error) {
				// Expected for new agents — profile doesn't exist until partial account is created
				console.log(
					"[AssistedOnboarding] Profile not found (expected for new agents)",
					error
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agentMobile]);

	// MARK: Compute provider props from agentDetails
	// These will be empty/undefined until agentDetails is fetched, which is fine —
	// the provider handles missing data gracefully (initializeSteps returns early).
	const onboardingSteps = getOnboardingStepsFromData(agentDetails);
	const roleList = getRoleListFromData(agentDetails);
	const userType = getUserTypeFromData(agentDetails);
	const userName = getUserNameFromData(agentDetails);
	const agreementId = getAgreementIdFromData(agentDetails);

	// MARK: Render Functions
	const renderCurrentStep = (): JSX.Element => {
		switch (step) {
			case ASSISTED_ONBOARDING_STEPS.ADD_AGENT:
				return (
					<AddAgentForm
						setStep={setStep}
						setAgentMobile={setAgentMobile}
						setAgentDetails={setAgentDetails}
					/>
				);

			case ASSISTED_ONBOARDING_STEPS.AGENT_STATUS_CHECK:
				return (
					<AgentStatusCheck
						setStep={setStep}
						onAgentDetailsFetched={setAgentDetails}
						fetchAgentDetails={fetchAgentDetails}
					/>
				);

			case ASSISTED_ONBOARDING_STEPS.AGENT_ALREADY_EXISTS:
				return <AgentAlreadyExistsScreen setStep={setStep} />;

			case ASSISTED_ONBOARDING_STEPS.OTP_VERIFICATION:
				return <OtpVerificationForm setStep={setStep} />;

			case ASSISTED_ONBOARDING_STEPS.ONBOARDING_WIDGET:
				return (
					<AgentOnboarding
						agentMobile={agentMobile}
						agentDetails={agentDetails}
						refreshAgentProfile={refreshAgentProfile}
					/>
				);

			case ASSISTED_ONBOARDING_STEPS.ONBOARDING_COMPLETED:
				return (
					<OnboardingCompleted
						setStep={setStep}
						resetAgentState={resetAgentState}
					/>
				);

			default:
				return <div>Oops! Something went wrong.</div>;
		}
	};

	/**
	 * Handle back navigation based on current step
	 * ADD_AGENT → Navigate to home/admin (exit flow)
	 * OTP_VERIFICATION → ADD_AGENT (re-enter mobile)
	 * All other steps → ADD_AGENT (start fresh)
	 */
	const handleBackNavigation = (): void => {
		switch (step) {
			case ASSISTED_ONBOARDING_STEPS.ADD_AGENT:
				// From Add Agent step, navigate to home or admin based on user type
				router.push(isAdmin ? "/admin" : "/home");
				break;

			case ASSISTED_ONBOARDING_STEPS.OTP_VERIFICATION:
				// From OTP, go back to add agent to re-enter mobile
				resetAgentState();
				setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT);
				break;

			case ASSISTED_ONBOARDING_STEPS.AGENT_ALREADY_EXISTS:
			case ASSISTED_ONBOARDING_STEPS.ONBOARDING_WIDGET:
			case ASSISTED_ONBOARDING_STEPS.ONBOARDING_COMPLETED:
				// From any other step, go back to start (doesn't make sense to go to intermediate steps)
				resetAgentState();
				setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT);
				break;

			default:
				// Fallback to ADD_AGENT
				resetAgentState();
				setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT);
		}
	};

	// MARK: JSX
	return (
		<>
			{/* Back button navigates based on current step - exits flow from Add Agent, goes to previous step otherwise */}
			<PageTitle
				title={stepBasedTitleMap[step]}
				onBack={handleBackNavigation}
			/>
			<Flex direction="column" align="center" px={{ base: 4, md: 0 }}>
				{/* OnboardingProvider wraps ALL assisted onboarding steps so
				    every step can access shared data (mobile, userName, etc.)
				    via useOnboardingContext(). */}
				<OnboardingProvider
					key={agentMobile || "no-agent"}
					mobile={agentMobile}
					userName={String(userName || "")}
					agreementId={String(agreementId || "")}
					onboardingSteps={onboardingSteps}
					roleList={roleList}
					userType={userType}
					orgMetadataOnboarding={orgDetail?.metadata?.onboarding}
					refreshAgentProfile={refreshAgentProfile}
				>
					{renderCurrentStep()}
				</OnboardingProvider>
			</Flex>
		</>
	);
};

export default AssistedOnboarding;
