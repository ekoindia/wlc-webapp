import { useEffect, useMemo, useState } from "react";

import { Flex } from "@chakra-ui/react";
import { Button } from "components/Button";
import useGeolocation from "hooks/useGeolocation";
import { useRouter } from "next/router";
import { parseEnvBoolean } from "utils/envUtils";
import type { OnboardingServices } from "../contracts";
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
	refreshAgentProfile: () => Promise<void>;
	/** Injected services from the host app */
	services: OnboardingServices;
	/** Org metadata for onboarding config (disabled steps, skippable steps, etc.) */
	orgMetadataOnboarding?: any;
	/** Whether self-onboarding is disabled */
	isSelfOnboardingDisabled?: boolean;
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
	refreshAgentProfile,
	services,
	orgMetadataOnboarding,
	isSelfOnboardingDisabled: isSelfOnboardingDisabledProp = false,
}: OnboardingWidgetProps): JSX.Element => {
	const [_selectedRole, setSelectedRole] = useState<string>("");

	const isSelfOnboardingDisabled =
		isSelfOnboardingDisabledProp ||
		parseEnvBoolean(process.env.NEXT_PUBLIC_DISABLE_SELF_ONBOARDING) ||
		false;

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

	// Parse `role` query param into allowed role ids (1: Retailer, 2: Distributor,
	// 3: Enterprise). E.g. "1,2,3" shows all three; "1,2" shows Retailer + Distributor.
	// Both normal login (/signup?role=xxx) and embedded (/gateway/onboarding?role=xxx)
	// deliver role via URL, so this is the single source of truth for both flows.
	// Guard on router.isReady: in Next.js pages router, router.query is empty until
	// client-side hydration completes, so reading it before isReady gives undefined.
	const allowedMerchantTypes = useMemo((): number[] | undefined => {
		if (!router.isReady) return undefined;
		const raw = router.query.role as string | undefined;
		if (!raw) return undefined;
		const parsed = raw
			.split(",")
			.map((s) => Number(s.trim()))
			.filter((n) => !isNaN(n));
		return parsed.length > 0 ? parsed : undefined;
	}, [router.isReady, router.query.role]);

	// Determine the user details to use for onboarding
	const onboardingUserDetails = isAssistedOnboarding
		? assistedAgentDetails
		: userData;

	// Get user type from user data
	const userType = useMemo(
		() => getUserTypeFromData(onboardingUserDetails),
		[onboardingUserDetails]
	);

	// React to userData changes after refresh to determine correct step
	useEffect(() => {
		// Get onboarding steps from user data
		const onboardingSteps = getOnboardingStepsFromData(
			onboardingUserDetails
		);

		// console.log("[OnboardingWidget] Step determination:", {
		// 	onboardingSteps,
		// 	onboardingUserDetails,
		// 	isAssistedOnboarding,
		// 	userType,
		// });

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
		userType === -1 && // Role not selected
		isSelfOnboardingDisabled
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
				// Hold off until router.isReady so allowedMerchantTypes is derived
				// from the fully-hydrated query and RoleSelection never flashes from
				// all roles → filtered roles.
				if (!router.isReady) return <OnboardingSkeleton />;
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
						accessToken={services.accessToken}
						generateNewToken={services.generateNewToken}
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
						services={services}
						orgMetadataOnboarding={orgMetadataOnboarding}
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
