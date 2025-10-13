import { useEffect, useState } from "react";

import { Center, Spinner } from "@chakra-ui/react";
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

	// State to manage the current step in the onboarding process
	const [step, setStep] = useState<keyof typeof ONBOARDING_STEPS>(
		ONBOARDING_STEPS.LOADING
	);

	// Determine the user details to use for onboarding
	const onboardingUserDetails = isAssistedOnboarding
		? assistedAgentDetails
		: userData;

	// why do I need to pass this twice??
	const onboardingSteps = getOnboardingStepsFromData(
		onboardingUserDetails,
		isAssistedOnboarding
	);

	useEffect(() => {
		if (onboardingSteps?.length > 0) {
			setStep(ONBOARDING_STEPS.KYC_FLOW);
		} else {
			setStep(ONBOARDING_STEPS.ROLE_SELECTION);
		}
	}, []);

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
	return <>{renderCurrentStep()}</>;
};

export default OnboardingWidget;
