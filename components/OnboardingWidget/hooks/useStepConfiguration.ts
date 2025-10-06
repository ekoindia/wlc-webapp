import {
	distributorStepsData,
	retailerStepsData,
	type OnboardingStep,
} from "constants/OnboardingSteps";
import { useCallback } from "react";

/**
 * User data interface for step configuration
 */
interface UserData {
	details?: {
		userDetails?: {
			user_type?: number;
		};
		onboarding_steps?: Array<{ role: number }>;
	};
}

/**
 * Assisted agent details interface
 */
interface AssistedAgentDetails {
	user_detail?: {
		onboarding_steps?: Array<{ role: number }>;
	};
}

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
	isAssistedOnboarding: boolean;
	assistedAgentDetails?: AssistedAgentDetails;
}

/**
 * Return type for useStepConfiguration hook
 */
interface UseStepConfigurationReturn {
	initializeSteps: (_userData: UserData) => void;
	getStepsForUserType: (_userType: number) => OnboardingStep[];
	filterStepsByRoles: (
		_stepData: OnboardingStep[],
		_onboardingSteps: Array<{ role: number }>
	) => OnboardingStep[];
}

/**
 * Custom hook for handling onboarding step configuration
 * Manages step setup based on user type and assisted onboarding flow
 * @param {UseStepConfigurationProps} props - Configuration object for the hook
 * @param {OnboardingActions} props.actions - State management actions for updating step data
 * @param {boolean} props.isAssistedOnboarding - Whether this is an assisted onboarding flow
 * @param {AssistedAgentDetails} [props.assistedAgentDetails] - Details of the assisted agent including their onboarding steps
 * @returns {UseStepConfigurationReturn} Object containing step configuration methods
 */
export const useStepConfiguration = ({
	actions,
	isAssistedOnboarding,
	assistedAgentDetails,
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
			onboardingSteps: Array<{ role: number }>
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
	 * Initializes onboarding steps based on user data and assisted onboarding settings
	 */
	const initializeSteps = useCallback(
		(userData: UserData) => {
			console.log(
				"[StepConfiguration] Initializing steps for userData:",
				userData
			);

			// Get user type and determine base step data
			const userType = userData?.details?.userDetails?.user_type;
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

			// Determine which onboarding steps to use
			const onboardingSteps = isAssistedOnboarding
				? assistedAgentDetails?.user_detail?.onboarding_steps
				: userData?.details?.onboarding_steps;

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
		[
			isAssistedOnboarding,
			assistedAgentDetails,
			getStepsForUserType,
			filterStepsByRoles,
			actions,
		]
	);

	return {
		initializeSteps,
		getStepsForUserType,
		filterStepsByRoles,
	};
};
