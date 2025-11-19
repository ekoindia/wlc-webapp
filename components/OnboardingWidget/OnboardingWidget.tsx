import { useEffect, useState } from "react";

import { Center, Flex, Spinner } from "@chakra-ui/react";
import { Button } from "components";
import { useAppSource } from "contexts";
import { useRouter } from "next/router";
import { isAndroidApp } from "utils/AndroidUtils";
import { parseEnvBoolean } from "utils/envUtils";
import OnboardingSteps from "./OnboardingSteps";
import RoleSelection from "./RoleSelection";
import { getOnboardingStepsFromData } from "./utils";

/**
 * Constants representing the different steps in the onboarding flow
 */
export const ONBOARDING_STEPS = {
	ROLE_SELECTION: "ROLE_SELECTION",
	KYC_FLOW: "KYC_FLOW",
	LOADING: "LOADING",
} as const;

interface OnboardingWidgetProps {
	logo?: string;
	appName?: string;
	orgName?: string;
	userData?: any;
	updateUserInfo?: (_data: any) => void;
	isAssistedOnboarding?: boolean;
	assistedAgentDetails?: any;
	allowedMerchantTypes?: number[];
	refreshAgentProfile: () => Promise<void>;
}

/**
 * A OnboardingWidget component for handling agent onboarding flow
 * @param {object} props - Properties passed to the component
 * @param {string} [props.isAssistedOnboarding] - Is the onboarding being done on behalf of a agent (assisted onboarding)
 * @param {any} [props.assistedAgentDetails] - Details of the assisted agent
 * @param {number[]} [props.allowedMerchantTypes] - Optional list of allowed merchant types for the onboarding process. Eg: [1,3] for Retailer and Distributor only.
 * @param props.refreshAgentProfile
 * @param props.logo
 * @param props.appName
 * @param props.orgName
 * @param props.userData
 * @param props.updateUserInfo
 * @returns {JSX.Element} - The rendered OnboardingWidget component
 * @example	`<OnboardingWidget></OnboardingWidget>`
 */
const OnboardingWidget = ({
	logo,
	appName,
	orgName,
	userData,
	isAssistedOnboarding = false,
	assistedAgentDetails,
	allowedMerchantTypes,
	refreshAgentProfile,
}: OnboardingWidgetProps): JSX.Element => {
	const [selectedRole, setSelectedRole] = useState<string>("");
	const [isInitializing, setIsInitializing] = useState<boolean>(true);

	// State to manage the current step in the onboarding process
	const [step, setStep] = useState<keyof typeof ONBOARDING_STEPS>(
		ONBOARDING_STEPS.LOADING
	);

	const router = useRouter();

	// Determine the user details to use for onboarding
	const onboardingUserDetails = isAssistedOnboarding
		? assistedAgentDetails
		: userData;

	const { appSource } = useAppSource();

	// Initialize onboarding by refreshing profile and determining the step
	useEffect(() => {
		const initializeOnboarding = async () => {
			// Refresh agent profile to get the latest onboarding state
			await refreshAgentProfile();

			// Mark initialization as complete after refresh
			setIsInitializing(false);
		};

		initializeOnboarding();
		// if passing refreshAgentProfile in dependency array, it creates infinite loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// React to userData changes after refresh to determine correct step
	// Only run after initialization is complete
	useEffect(() => {
		if (isInitializing) {
			return; // Don't determine step until refresh completes
		}

		// Get onboarding steps from user data
		const onboardingSteps = getOnboardingStepsFromData(
			onboardingUserDetails,
			isAssistedOnboarding
		);

		console.log("[OnboardingWidget] Step determination:", {
			onboardingSteps,
			onboardingUserDetails,
			isAssistedOnboarding,
		});

		// Determine which step to show based on data
		if (onboardingSteps?.length > 0) {
			console.log("[OnboardingWidget] Setting step to KYC_FLOW");
			setStep(ONBOARDING_STEPS.KYC_FLOW);
		} else {
			console.log("[OnboardingWidget] Setting step to ROLE_SELECTION");
			setStep(ONBOARDING_STEPS.ROLE_SELECTION);
		}
	}, [onboardingUserDetails, isAssistedOnboarding, isInitializing]);

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
						selectedRole={selectedRole}
						setSelectedRole={setSelectedRole}
						isAssistedOnboarding={isAssistedOnboarding}
						userData={userData}
						assistedAgentDetails={assistedAgentDetails}
						allowedMerchantTypes={allowedMerchantTypes}
						refreshAgentProfile={refreshAgentProfile}
					/>
				);
			case "KYC_FLOW":
				return (
					<OnboardingSteps
						isAssistedOnboarding={isAssistedOnboarding}
						logo={logo}
						appName={appName}
						orgName={orgName}
						userData={userData}
						assistedAgentDetails={assistedAgentDetails}
						refreshAgentProfile={refreshAgentProfile}
					/>
				);
			default:
				return (
					<Center minH="200px">
						<Spinner size="lg" color="primary.DEFAULT" />
					</Center>
				);
		}
	};
	// MARK: JSX
	return (
		<Flex w="100%" justify="center">
			{renderCurrentStep()}
			<Flex fontSize="0.3em" color="#777">
				{isAndroidApp() ? "Android" : "Web"} - {appSource}
			</Flex>
		</Flex>
	);
};

export default OnboardingWidget;
