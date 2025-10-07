import {
	distributorStepsData,
	retailerStepsData,
	type OnboardingStep,
} from "constants/OnboardingSteps";
import { useCallback } from "react";
import {
	getOnboardingStepsFromData,
	getUserTypeFromData,
	type UnifiedUserData,
} from "../utils";

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
}

/**
 * Return type for useStepConfiguration hook
 */
interface UseStepConfigurationReturn {
	initializeSteps: (_userData: UnifiedUserData) => void;
	getStepsForUserType: (_userType: number) => OnboardingStep[];
	filterStepsByRoles: (
		_stepData: OnboardingStep[],
		_onboardingSteps: Array<{ role: number; label?: string }>
	) => OnboardingStep[];
	getUserTypeFromData: (_userData: UnifiedUserData) => number | undefined;
	getOnboardingStepsFromData: (
		_userData: UnifiedUserData
	) => Array<{ role: number; label?: string }> | undefined;
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
}: UseStepConfigurationProps): UseStepConfigurationReturn => {
	/**
	 * Gets the appropriate step data based on user type
	 */
	const getStepsForUserType = useCallback(
		(userType: number): OnboardingStep[] => {
			switch (userType) {
				case 1: // Distributor
					return distributorStepsData;
				case 3: // Retailer
					return retailerStepsData;
				default:
					console.warn(`Unknown user type: ${userType}`);
					return [];
			}
		},
		[]
	);

	/**
	 * Filters step data based on onboarding step roles
	 */
	const filterStepsByRoles = useCallback(
		(
			stepData: OnboardingStep[],
			onboardingSteps: Array<{ role: number; label?: string }>
		): OnboardingStep[] => {
			const filteredSteps: OnboardingStep[] = [];

			onboardingSteps?.forEach((step) => {
				const matchingSteps = stepData?.filter(
					(singleStep) => singleStep.role === step.role
				);
				filteredSteps.push(...matchingSteps);
			});

			return filteredSteps;
		},
		[]
	);

	/**
	 * Initializes onboarding steps based on user data
	 */
	const initializeSteps = useCallback(
		(userData: UnifiedUserData) => {
			console.log(
				"[StepConfiguration] Initializing steps for userData:",
				userData
			);

			// Get user type using utility function
			const userType = getUserTypeFromData(userData);
			if (!userType) {
				console.warn(
					"[StepConfiguration] No user type found in userData"
				);
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
			const onboardingSteps = getOnboardingStepsFromData(userData);

			if (!onboardingSteps || onboardingSteps.length === 0) {
				console.warn("[StepConfiguration] No onboarding steps found");
				return;
			}

			// Filter steps based on roles
			const filteredSteps = filterStepsByRoles(
				baseStepData,
				onboardingSteps
			);

			console.log("[StepConfiguration] Filtered steps:", filteredSteps);

			// Set the stepper data with filtered steps
			// Create a new array to prevent reference issues
			actions.setStepperData([...filteredSteps]);
		},
		[getStepsForUserType, filterStepsByRoles, actions]
	);

	return {
		initializeSteps,
		getStepsForUserType,
		filterStepsByRoles,
		getUserTypeFromData,
		getOnboardingStepsFromData,
	};
};
