import {
	distributorStepsData,
	filterOnboardingStepsByRoles,
	retailerStepsData,
	type OnboardingStep,
} from "constants/OnboardingSteps";
import { useCallback } from "react";
import { type UnifiedUserData } from "../utils";

/**
 * Gets the appropriate step data based on user type
 * @param userType
 */
const getStepsForUserType = (userType: number): OnboardingStep[] => {
	switch (userType) {
		case 1: // Distributor
			return distributorStepsData;
		case 3: // Retailer
			return retailerStepsData;
		default:
			console.warn(`Unknown user type: ${userType}`);
			return [];
	}
};

/**
 * Onboarding actions interface for step configuration
 */
interface OnboardingActions {
	setStepperData: (_data: OnboardingStep[]) => void;
}

/**
 * Props for useStepConfiguration hook
 */
interface UseStepConfigurationProps {
	actions: OnboardingActions;
	userType: number;
	onboardingSteps: Array<{ role: number; label?: string }>;
}

/**
 * Return type for useStepConfiguration hook
 */
interface UseStepConfigurationReturn {
	initializeSteps: (_userData: UnifiedUserData) => void;
}

/**
 * Custom hook for handling onboarding step configuration
 * Manages step setup based on user type for both normal and assisted onboarding flows
 * @param {UseStepConfigurationProps} props - Configuration object for the hook
 * @param {OnboardingActions} props.actions - State management actions for updating step data
 * @returns {UseStepConfigurationReturn} Object containing step configuration methods
 */
export const useStepConfiguration = ({
	actions,
	userType,
	onboardingSteps,
}: UseStepConfigurationProps): UseStepConfigurationReturn => {
	/**
	 * Initializes onboarding steps based on user data
	 */
	const initializeSteps = useCallback((userData) => {
		console.log(
			"[StepConfiguration] Initializing steps for userData:",
			userData
		);

		// Get user type using utility function
		if (!userType) {
			console.warn("[StepConfiguration] No user type found in userData");
			return;
		}

		const baseStepData = getStepsForUserType(userType);
		if (baseStepData.length === 0) {
			console.warn(
				"[StepConfiguration] No base step data found for user type:",
				userType
			);
			return;
		}

		// Get onboarding steps using utility function

		if (!onboardingSteps || onboardingSteps.length === 0) {
			console.warn("[StepConfiguration] No onboarding steps found");
			return;
		}

		// Filter steps based on roles
		const filteredSteps = filterOnboardingStepsByRoles(
			baseStepData,
			onboardingSteps
		);

		console.log("[StepConfiguration] Filtered steps:", filteredSteps);

		// Set the stepper data with filtered steps
		// Create a new array to prevent reference issues
		actions.setStepperData([...filteredSteps]);
	}, []);

	return {
		initializeSteps,
	};
};
