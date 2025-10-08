import { type OnboardingStep } from "constants/OnboardingSteps";
import { useState } from "react";

import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";
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
	isAssistedOnboarding?: boolean;
	assistedAgentDetails?: any;
}

/**
 * A OnboardingWidget component for handling agent onboarding flow
 * @param {object} props - Properties passed to the component
 * @param {string} [props.isAssistedOnboarding] - Is the onboarding being done on behalf of a agent (assisted onboarding)
 * @param {OnboardingStep} [props.roleSelectionStep] - Custom role selection step configuration
 * @param {any} [props.assistedAgentDetails] - Details of the assisted agent
 * @returns {JSX.Element} - The rendered OnboardingWidget component
 * @example	`<OnboardingWidget></OnboardingWidget>`
 */
const OnboardingWidget = ({
	isAssistedOnboarding = false,
	assistedAgentDetails,
}: OnboardingWidgetProps): JSX.Element => {
	const { userData, updateUserInfo } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { logo, app_name, org_name } = orgDetail ?? {};
	const [selectedRole, setSelectedRole] = useState<string>("");

	// State to manage the current step in the onboarding process
	const [step, setStep] = useState<keyof typeof ONBOARDING_STEPS>(
		ONBOARDING_STEPS.ROLE_SELECTION
	);

	const renderCurrentStep = () => {
		switch (step) {
			case "ROLE_SELECTION":
				return (
					<RoleSelection
						setStep={setStep}
						setSelectedRole={setSelectedRole}
						isAssistedOnboarding={isAssistedOnboarding}
						logo={logo}
						appName={app_name}
						orgName={org_name}
						userData={userData}
						updateUserInfo={updateUserInfo}
					/>
				);
			case "KYC_FLOW":
				return (
					<OnboardingSteps
						// setStep={setStep}
						selectedRole={selectedRole}
						isAssistedOnboarding={isAssistedOnboarding}
						logo={logo}
						appName={app_name}
						orgName={org_name}
						userData={userData}
						updateUserInfo={updateUserInfo}
						assistedAgentDetails={assistedAgentDetails}
					/>
				);
			default:
				return "Loading...";
		}
	};
	// MARK: JSX
	return <>{renderCurrentStep()}</>;
};

export default OnboardingWidget;
