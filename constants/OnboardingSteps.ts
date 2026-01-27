/**
 * @deprecated Import from 'features/onboarding' instead
 * This file is kept for backward compatibility with legacy imports
 */
export {
	// Constants
	APPLICANT_TYPES,
	ONBOARDING_API_STATUS,
	ONBOARDING_STEP_IDS,
	ONBOARDING_STEP_STATUS,
	createRoleSelectionStep,
	filterOnboardingStepsByRoles,
	// Functions
	generateRoleData,
	masterOnboardingSteps,
	roleSelectionStepData,
	visibleAgentTypes,
	// Types
	type OnboardingApiStatus,
	type OnboardingStep,
	type OnboardingStepId,
	type OnboardingStepStatusType,
	type Role,
	type RoleConfig,
} from "features/onboarding";
