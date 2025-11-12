import {
	filterOnboardingStepsByRoles,
	masterOnboardingSteps,
	type OnboardingStep,
} from "constants/OnboardingSteps";
import { useCallback } from "react";
import { type UnifiedUserData } from "../utils";

/**
 * Gets the appropriate step data based on user type
 * Returns the master list of all steps - filtering happens via API roles
 * @param {number} userType - The user type identifier (validated but not used for step selection)
 * @returns {OnboardingStep[]} Master list of all onboarding steps
 */
const getStepsForUserType = (userType: number): OnboardingStep[] => {
	// Return master list for all user types
	// API-driven filtering happens in filterOnboardingStepsByRoles
	if (userType === undefined || userType === null) {
		console.warn(`No user type provided`);
		return [];
	}
	return masterOnboardingSteps;
};

/**
 * Filters out disabled steps based on org metadata configuration
 * @param {OnboardingStep[]} steps - Steps to filter
 * @param {number[]} [disabledSteps] - Array of step IDs to exclude
 * @returns {OnboardingStep[]} Steps with disabled ones removed
 */
const filterDisabledSteps = (
	steps: OnboardingStep[],
	disabledSteps?: number[]
): OnboardingStep[] => {
	if (!disabledSteps || disabledSteps.length === 0) {
		return steps;
	}

	const filteredSteps = steps.filter((step) => {
		const isDisabled = disabledSteps.includes(step.id);
		if (isDisabled) {
			console.log(
				`[StepConfiguration] Filtering out disabled step: ${step.name} (ID: ${step.id})`
			);
		}
		return !isDisabled;
	});

	return filteredSteps;
};

/**
 * Marks steps as skippable (isRequired = false) based on org metadata configuration
 * @param {OnboardingStep[]} steps - Steps to process
 * @param {number[]} [skippableSteps] - Array of step IDs that should be marked as skippable
 * @returns {OnboardingStep[]} Steps with isRequired updated for skippable ones
 */
const applySkippableSteps = (
	steps: OnboardingStep[],
	skippableSteps?: number[]
): OnboardingStep[] => {
	if (!skippableSteps || skippableSteps.length === 0) {
		return steps;
	}

	return steps.map((step) => {
		const isSkippable = skippableSteps.includes(step.id);
		if (isSkippable) {
			console.log(
				`[StepConfiguration] Marking step as skippable: ${step.name} (ID: ${step.id})`
			);
			return {
				...step,
				isRequired: false,
			};
		}
		return step;
	});
};

/**
 * Applies the filter chain to onboarding steps
 * Filter order: 1) Role-based filtering, 2) Disabled steps filtering, 3) Skippable steps marking
 * @param {OnboardingStep[]} baseStepData - Master list of all steps
 * @param {Array<{ role: number; label?: string }>} onboardingSteps - API onboarding steps with roles
 * @param {number[]} [disabledSteps] - Array of step IDs to exclude from org metadata
 * @param {number[]} [skippableSteps] - Array of step IDs to mark as skippable (isRequired=false)
 * @returns {OnboardingStep[]} Filtered and configured steps (without status assignment)
 */
const applyStepFilters = (
	baseStepData: OnboardingStep[],
	onboardingSteps: Array<{ role: number; label?: string }>,
	disabledSteps?: number[],
	skippableSteps?: number[]
): OnboardingStep[] => {
	// Filter 1: Role-based filtering (API-driven)
	let filteredSteps = filterOnboardingStepsByRoles(
		baseStepData,
		onboardingSteps
	);

	// Filter 2: Disabled steps filtering (org metadata-driven)
	filteredSteps = filterDisabledSteps(filteredSteps, disabledSteps);

	// Filter 3: Skippable steps marking (org metadata-driven)
	filteredSteps = applySkippableSteps(filteredSteps, skippableSteps);

	return filteredSteps;
};

/**
 * Applies resume logic to set step completion status based on roleList
 * Logic:
 * - Find the first step whose role appears in roleList (current pending step)
 * - Mark all steps before as completed (3)
 * - Mark the current step as pending (1)
 * - Mark all steps after as not started (0)
 * @param {OnboardingStep[]} steps - Filtered steps to apply status to
 * @param {Array<number> | string} [roleList] - Comma-separated string or array of completed role IDs
 * @returns {OnboardingStep[]} Steps with status assigned
 */
const applyResumeLogic = (
	steps: OnboardingStep[],
	roleList?: Array<number> | string
): OnboardingStep[] => {
	if (!roleList) {
		return steps;
	}

	let _currentRoleIndex = -1;

	// Convert roleList to array of numbers
	const roleArray = Array.isArray(roleList)
		? roleList
		: roleList.split(",").map(Number);

	// Find the first step whose role matches any in roleList
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		if (roleArray.includes(step.role)) {
			_currentRoleIndex = i;
			break;
		}
	}

	// Assign step status based on current role index
	steps.forEach((step, index) => {
		if (index < _currentRoleIndex) {
			step.stepStatus = 3; // completed
		} else if (index === _currentRoleIndex) {
			step.stepStatus = 1; // pending
		} else {
			step.stepStatus = 0; // not started
		}
	});

	return steps;
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
	disabledSteps?: number[];
	skippableSteps?: number[];
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
	disabledSteps,
	skippableSteps,
}: UseStepConfigurationProps): UseStepConfigurationReturn => {
	/**
	 * Initializes onboarding steps based on user data
	 * Applies filter chain: 1) Role-based, 2) Disabled steps, 3) Skippable steps, 4) Resume logic
	 */
	const initializeSteps = useCallback(
		(userData) => {
			console.log(
				"[StepConfiguration] Initializing steps for userData:",
				userData
			);

			// Validate user type
			if (!userType) {
				console.warn(
					"[StepConfiguration] No user type found in userData"
				);
				return;
			}

			// Get base step data (master list)
			const baseStepData = getStepsForUserType(userType);
			if (baseStepData.length === 0) {
				console.warn(
					"[StepConfiguration] No base step data found for user type:",
					userType
				);
				return;
			}

			// Validate onboarding steps from API
			if (!onboardingSteps || onboardingSteps.length === 0) {
				console.warn("[StepConfiguration] No onboarding steps found");
				return;
			}

			// Apply filter chain:
			// 1. Role-based filtering (API-driven)
			// 2. Disabled steps filtering (org metadata-driven)
			// 3. Skippable steps marking (org metadata-driven)
			let filteredSteps = applyStepFilters(
				baseStepData,
				onboardingSteps,
				disabledSteps,
				skippableSteps
			);

			// Apply resume logic: Set step completion status based on roleList
			filteredSteps = applyResumeLogic(filteredSteps, roleList);

			console.log(
				"[StepConfiguration] Final filtered steps:",
				filteredSteps.map((s) => ({
					id: s.id,
					name: s.name,
					status: s.stepStatus,
					isRequired: s.isRequired,
				}))
			);

			// Set the stepper data with filtered steps
			// Create a new array to prevent reference issues
			actions.setStepperData([...filteredSteps]);
		},
		[
			actions,
			userType,
			onboardingSteps,
			roleList,
			disabledSteps,
			skippableSteps,
		]
	);

	return {
		initializeSteps,
	};
};
