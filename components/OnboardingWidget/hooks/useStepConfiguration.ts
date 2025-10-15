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
	roleList?: Array<number> | string;
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
	roleList,
}: UseStepConfigurationProps): UseStepConfigurationReturn => {
	/**
	 * Initializes onboarding steps based on user data
	 */
	const initializeSteps = useCallback(
		(userData) => {
			console.log(
				"[StepConfiguration] Initializing steps for userData:",
				userData
			);

			// Get user type using utility function
			if (!userType) {
				console.warn(
					"[StepConfiguration] No user type found in userData"
				);
				return;
			}

			// console.log(
			// 	"[AgentOnboarding] useStepCOnfiguration roleList",
			// 	roleList
			// );

			const baseStepData = getStepsForUserType(userType);
			if (baseStepData.length === 0) {
				console.warn(
					"[StepConfiguration] No base step data found for user type:",
					userType
				);
				return;
			}

			if (!onboardingSteps || onboardingSteps.length === 0) {
				console.warn("[StepConfiguration] No onboarding steps found");
				return;
			}

			// Filter steps based on roles
			const filteredSteps = filterOnboardingStepsByRoles(
				baseStepData,
				onboardingSteps
			);

			// Logic:
			// 1. Find the first step in filteredSteps whose role appears in roleList → this is the current active (pending) step.
			// 2. All steps before the current step → mark as completed (3).
			// 3. The current step → mark as pending (1).
			// 4. All steps after the current step → mark as not started (0).
			//
			// Steps:
			// - Convert roleList (string or array) into an array of numeric role IDs.
			// - Find the first step whose role matches any in roleList.
			// - Assign stepStatus to each step based on its position relative to the current role index.

			if (roleList) {
				let _currentRoleIndex = -1;

				for (let i = 0; i < filteredSteps.length; i++) {
					const step = filteredSteps[i];
					// roleList is comma separated string
					const roleArray = Array.isArray(roleList)
						? roleList
						: roleList.split(",").map(Number);
					if (roleArray.includes(step.role)) {
						_currentRoleIndex = i;
						break;
					}
				}

				// now mark every step before _currentRoleIndex as completed (3)
				// mark the step at _currentRoleIndex as pending (1)
				// mark every step after _currentRoleIndex as not started (0)
				filteredSteps.forEach((step, index) => {
					if (index < _currentRoleIndex) {
						step.stepStatus = 3; // completed
					} else if (index === _currentRoleIndex) {
						step.stepStatus = 1; // pending
					} else {
						step.stepStatus = 0; // not started
					}
				});
			}

			// console.log(
			// 	"[AgentOnboarding] useStepConfig Filtered steps:",
			// 	filteredSteps
			// );

			// Set the stepper data with filtered steps
			// Create a new array to prevent reference issues
			actions.setStepperData([...filteredSteps]);
		},
		[actions, userType, onboardingSteps, roleList]
	);

	return {
		initializeSteps,
	};
};
