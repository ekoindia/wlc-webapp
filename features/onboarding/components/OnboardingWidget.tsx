import { useEffect, useMemo, useState } from "react";

import { Flex } from "@chakra-ui/react";
import { Button } from "components/Button";
import useGeolocation from "hooks/useGeolocation";
import { useRouter } from "next/router";
import { parseEnvBoolean } from "utils/envUtils";
import { getOnboardingStepsFromData, getUserTypeFromData } from "../utils";
import OnboardingSkeleton from "./OnboardingSkeleton";
import OnboardingSteps from "./OnboardingSteps";
import RoleSelection from "./RoleSelection";

/**
 * Constants representing the different steps in the onboarding flow
 */
export const ONBOARDING_STEPS = {
	ROLE_SELECTION: "ROLE_SELECTION",
	KYC_FLOW: "KYC_FLOW",
	LOADING: "LOADING",
} as const;

interface OnboardingWidgetProps {
	userData?: any;
	updateUserInfo?: (_data: any) => void;
	isAssistedOnboarding?: boolean;
	assistedAgentDetails?: any;
	agentMobile?: string;
	allowedMerchantTypes?: number[];
	refreshAgentProfile: () => Promise<void>;
}

/**
 * A OnboardingWidget component for handling agent onboarding flow
 * @param {object} props - Properties passed to the component
 * @param {string} [props.isAssistedOnboarding] - Is the onboarding being done on behalf of a agent (assisted onboarding)
 * @param {any} [props.assistedAgentDetails] - Details of the assisted agent
 * @param {string} [props.agentMobile] - Mobile number of the assisted agent
 * @param {number[]} [props.allowedMerchantTypes] - Optional list of allowed merchant types for the onboarding process. Eg: [1,3] for Retailer and Distributor only.
 * @param props.refreshAgentProfile
 * @param props.userData
 * @param props.updateUserInfo
 * @returns {JSX.Element} - The rendered OnboardingWidget component
 * @example	`<OnboardingWidget></OnboardingWidget>`
 */
/** Default fallback coordinates when geolocation fails or is denied */
const DEFAULT_LATLONG = "27.176670,78.008075,0";

const OnboardingWidget = ({
	userData,
	isAssistedOnboarding = false,
	assistedAgentDetails,
	agentMobile,
	allowedMerchantTypes,
	refreshAgentProfile,
}: OnboardingWidgetProps): JSX.Element => {
	const [_selectedRole, setSelectedRole] = useState<string>("");

	// Fetch geolocation early on widget mount
	const { latitude, longitude, accuracy } = useGeolocation({
		highAccuracy: false,
		timeout: 10000,
		maximumAge: 60000,
	});

	/**
	 * Format geolocation as "lat,long,accuracy" string for API consumption.
	 * Falls back to default coordinates if geolocation is unavailable.
	 */
	const initialLatLong = useMemo((): string => {
		if (latitude !== null && longitude !== null) {
			return `${latitude},${longitude},${accuracy ?? 0}`;
		}
		return DEFAULT_LATLONG;
	}, [latitude, longitude, accuracy]);

	// State to manage the current step in the onboarding process
	const [step, setStep] = useState<keyof typeof ONBOARDING_STEPS>(
		ONBOARDING_STEPS.LOADING
	);

	const router = useRouter();

	// Determine the user details to use for onboarding
	const onboardingUserDetails = isAssistedOnboarding
		? assistedAgentDetails
		: userData;

	// React to userData changes after refresh to determine correct step
	useEffect(() => {
		// Get onboarding steps from user data
		const onboardingSteps = getOnboardingStepsFromData(
			onboardingUserDetails
		);

		const userType = getUserTypeFromData(onboardingUserDetails);

		console.log("[OnboardingWidget] Step determination:", {
			onboardingSteps,
			onboardingUserDetails,
			isAssistedOnboarding,
			userType,
		});

		// Determine which step to show based on data
		if (onboardingSteps?.length > 0) {
			console.log("[OnboardingWidget] Setting step to KYC_FLOW");
			setStep(ONBOARDING_STEPS.KYC_FLOW);
		} else if (!userType || userType === -1) {
			// Only show role selection if user has no role assigned
			// userType -1 indicates "no user type selected" (pending state)
			console.log("[OnboardingWidget] Setting step to ROLE_SELECTION");
			setStep(ONBOARDING_STEPS.ROLE_SELECTION);
		} else {
			// User has role but no steps (completed or loading), stay in LOADING/Skeleton
			console.log(
				"[OnboardingWidget] User has role but no steps - keeping LOADING state"
			);
		}
	}, [onboardingUserDetails, isAssistedOnboarding]);

	if (
		isAssistedOnboarding !== true &&
		parseEnvBoolean(process.env.NEXT_PUBLIC_DISABLE_SELF_ONBOARDING)
	) {
		// Self-onboarding is disabled for this app instance.
		return (
			<Flex
				direction="column"
				align="center"
				justify="center"
				h="100%"
				minH="100%"
				w="100%"
				gap="2em"
				p="2em 1em"
				bg="white"
			>
				<p>User not found</p>
				{/* Go back to home page */}
				<Button onClick={() => router.replace("/")}>Back</Button>
			</Flex>
		);
	}

	// MARK: Get Step
	const renderCurrentStep = () => {
		switch (step) {
			case "ROLE_SELECTION":
				return (
					<RoleSelection
						setStep={setStep}
						setSelectedRole={setSelectedRole}
						isAssistedOnboarding={isAssistedOnboarding}
						userData={userData}
						assistedAgentDetails={assistedAgentDetails}
						agentMobile={agentMobile}
						allowedMerchantTypes={allowedMerchantTypes}
						refreshAgentProfile={refreshAgentProfile}
					/>
				);
			case "KYC_FLOW":
				return (
					<OnboardingSteps
						isAssistedOnboarding={isAssistedOnboarding}
						userData={userData}
						assistedAgentDetails={assistedAgentDetails}
						refreshAgentProfile={refreshAgentProfile}
						initialLatLong={initialLatLong}
					/>
				);
			default:
				return <OnboardingSkeleton />;
		}
	};
	// MARK: JSX
	return (
		<Flex w="100%" justify="center">
			{renderCurrentStep()}
		</Flex>
	);
};

export default OnboardingWidget;
