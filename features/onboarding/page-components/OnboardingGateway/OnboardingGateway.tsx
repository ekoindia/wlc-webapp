import { Flex } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useNetworkUsers, usePubSub, useUser } from "contexts";
import { useAppSource } from "contexts/AppSourceContext";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import dynamic from "next/dynamic";
import LoginWidget from "page-components/LoginPanel/LoginWidget/LoginWidget";
import React, { useCallback, useMemo, useState } from "react";
import { OnboardingProvider } from "../../context";
import type { OnboardingServices } from "../../contracts";
import {
	getAgreementIdFromData,
	getEmailFromData,
	getOnboardingStepsFromData,
	getRoleListFromData,
	getUserNameFromData,
	getUserTypeFromData,
} from "../../utils";
import {
	type AgentAlreadyExistsScreenProps,
	type OnboardingCompletedProps,
} from "../AssistedOnboarding";

/**
 * Constants representing the different steps in the assisted onboarding flow
 */
export const ONBOARDING_GATEWAY_STEPS = {
	ADD_AGENT: "ADD_AGENT",
	AGENT_STATUS_CHECK: "AGENT_STATUS_CHECK",
	AGENT_ALREADY_EXISTS: "AGENT_ALREADY_EXISTS",
	ONBOARDING_WIDGET: "ONBOARDING_WIDGET",
	ONBOARDING_COMPLETED: "ONBOARDING_COMPLETED",
} as const;

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

const AgentStatusCheck = dynamic(
	() => import("../AssistedOnboarding/AgentStatusCheck"),
	{
		ssr: false,
	}
);

const AgentAlreadyExistsScreen = dynamic(
	() => import("../AssistedOnboarding/AgentAlreadyExistsScreen"),
	{ ssr: false }
) as React.ComponentType<AgentAlreadyExistsScreenProps>;

// Removed OtpVerificationForm since we're using OnboardingGatewayVerifyOtp

const OnboardingWidget = dynamic(
	() => import("../../components/OnboardingWidget"),
	{ ssr: false }
);

const OnboardingCompleted = dynamic(
	() => import("../AssistedOnboarding/OnboardingCompleted"),
	{
		ssr: false,
	}
) as React.ComponentType<OnboardingCompletedProps>;

export interface OnboardingGatewayProps {
	token?: string;
	/**
	 * Pre-fill the mobile number input from the URL query param. When set,
	 *  the cached last-login number is intentionally bypassed.
	 */
	mobile?: string;
}

/**
 * AssistedOnboarding component that manages the multi-step agent onboarding flow.
 *
 * This component wraps the entire assisted flow in an OnboardingProvider so that
 * every step (pre-KYC and KYC) has access to shared data (mobile, userName, etc.)
 * via useOnboardingContext().
 * @param {OnboardingGatewayProps} props - Component props
 * @param {string} [props.token] - Gateway auth token
 * @returns {JSX.Element} The rendered OnboardingGateway component
 */
const OnboardingGateway = ({ mobile }: OnboardingGatewayProps): JSX.Element => {
	// console.log("[Onboarding] prefill mobile", mobile);

	const { accessToken, userData } = useUser();
	const { generateNewToken } = useRefreshToken();
	const { refreshUserList } = useNetworkUsers();
	const { orgDetail } = useOrgDetailContext();
	const { isAndroid } = useAppSource();
	const pubsub = usePubSub();

	console.log("[Onboarding] orgDetail", orgDetail);
	console.log("[Onboarding] accessToken", accessToken);
	console.log("[Onboarding] userData", userData);

	const services: OnboardingServices = useMemo(
		() => ({
			accessToken,
			generateNewToken,
			isAndroid,
			pubsub,
		}),
		[accessToken, generateNewToken, isAndroid, pubsub]
	);

	const [step, setStep] = useState<keyof typeof ONBOARDING_GATEWAY_STEPS>(
		ONBOARDING_GATEWAY_STEPS.ADD_AGENT
	);
	const [agentMobile, setAgentMobile] = useState<string>("");
	const [agentDetails, setAgentDetails] = useState<any>(null);

	// agentServices overrides accessToken with the agent's token (from the login
	// response stored in agentDetails). All agent-side API calls — role selection,
	// KYC steps, agreement signing — must use this token, not the admin's.
	// Falls back to the admin token before the agent has logged in.
	const agentServices: OnboardingServices = useMemo(
		() => ({
			...services,
			accessToken: agentDetails?.access_token ?? accessToken,
		}),
		[services, agentDetails, accessToken]
	);

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
		// Use the agent's own token after login; fall back to admin token before login.
		const token = agentDetails?.access_token ?? accessToken;
		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL +
					Endpoints.REFRESH_PROFILE,
				{
					body: {
						csp_id: mobile,
					},
					token,
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
					setStep(ONBOARDING_GATEWAY_STEPS.ONBOARDING_COMPLETED);
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
	}, [agentMobile, accessToken, agentDetails]);

	// MARK: Compute provider props from agentDetails
	// These will be empty/undefined until agentDetails is fetched, which is fine —
	// the provider handles missing data gracefully (initializeSteps returns early).
	const onboardingSteps = getOnboardingStepsFromData(agentDetails);
	const roleList = getRoleListFromData(agentDetails);
	console.log("[Gateway] roleList", roleList);
	const userType = getUserTypeFromData(agentDetails);
	const userName = getUserNameFromData(agentDetails);
	const agreementId = getAgreementIdFromData(agentDetails);
	const email = getEmailFromData(agentDetails);

	// MARK: Render Functions
	const renderCurrentStep = (): JSX.Element => {
		switch (step) {
			case ONBOARDING_GATEWAY_STEPS.ADD_AGENT:
				return (
					<LoginWidget
						mode="embedded"
						hideLogo={true}
						{...(mobile
							? {
									initialMobile: mobile,
								}
							: {})}
						onLoginSuccess={(response: any, mobile?: string) => {
							if (response?.access_token && response?.details) {
								setAgentMobile(
									mobile ||
										response.details.mobile ||
										response.details.signup_mobile ||
										""
								);
								setAgentDetails({
									...response,
									userDetails: response.details,
									onboarding_steps:
										response.details.onboarding_steps,
									role_list: response.details.role_list,
								});
								setStep(
									ONBOARDING_GATEWAY_STEPS.ONBOARDING_WIDGET
								);
							}
						}}
					/>
				);

			case ONBOARDING_GATEWAY_STEPS.AGENT_STATUS_CHECK:
				return (
					<AgentStatusCheck
						setStep={setStep as any}
						onAgentDetailsFetched={setAgentDetails}
						fetchAgentDetails={fetchAgentDetails}
					/>
				);

			case ONBOARDING_GATEWAY_STEPS.AGENT_ALREADY_EXISTS:
				return <AgentAlreadyExistsScreen setStep={setStep as any} />;

			case ONBOARDING_GATEWAY_STEPS.ONBOARDING_WIDGET:
				return (
					<OnboardingWidget
						userData={agentDetails}
						updateUserInfo={() => {}}
						isAssistedOnboarding={false}
						agentMobile={agentMobile}
						refreshAgentProfile={refreshAgentProfile}
						services={agentServices}
					/>
				);

			case ONBOARDING_GATEWAY_STEPS.ONBOARDING_COMPLETED:
				return (
					<OnboardingCompleted
						setStep={setStep as any}
						resetAgentState={resetAgentState}
					/>
				);

			default:
				return <div>Oops! Something went wrong.</div>;
		}
	};

	// MARK: JSX
	return (
		<Flex direction="column" align="center" px={{ base: 4, md: 0 }}>
			{/* OnboardingProvider wraps ALL assisted onboarding steps so
                    every step can access shared data (mobile, userName, etc.)
                    via useOnboardingContext(). */}
			<OnboardingProvider
				key={agentMobile || "no-agent"}
				services={agentServices}
				mobile={agentMobile}
				userName={String(userName || "")}
				agreementId={String(agreementId || "")}
				email={String(email || "")}
				onboardingSteps={onboardingSteps}
				roleList={roleList}
				userType={userType}
				orgMetadataOnboarding={orgDetail?.metadata?.onboarding}
				refreshAgentProfile={refreshAgentProfile}
			>
				{renderCurrentStep()}
			</OnboardingProvider>
		</Flex>
	);
};

export default OnboardingGateway;
