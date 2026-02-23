/**
 * Onboarding Feature
 *
 * Provides self-onboarding and assisted onboarding workflows with:
 * - OnboardingWidget component for step-based flow
 * - Hooks for state management, API submission, and integrations
 * - Role selection and step configuration
 */

// Components
export { OnboardingSteps, OnboardingWidget, RoleSelection } from "./components";

// Hooks
export { useOnboardingState, useStepExecutor } from "./hooks";

// Context
export {
	OnboardingProvider,
	useOnboardingContext,
	type OnboardingContextValue,
} from "./context";

export type {
	OnboardingAction,
	OnboardingState,
	OnboardingStateHook,
} from "./hooks";

// Utils
export * from "./utils";
export { filterOnboardingStepsByRoles } from "./utils";

// Constants
export {
	APPLICANT_TYPES,
	ONBOARDING_STEP_IDS,
	ONBOARDING_STEP_STATUS,
	masterOnboardingSteps,
} from "./constants";

// Types from constants
export type {
	OnboardingStep,
	OnboardingStepStatusType,
	PipelineState,
} from "./constants";

// Role selection types re-exported from utils
export type { Role, RoleConfig } from "./utils/roleSelection";

// Page Components
export {
	ASSISTED_ONBOARDING_STEPS,
	// Assisted Onboarding
	AddAgentForm,
	AgentAlreadyExistsScreen,
	AgentOnboarding,
	AgentStatusCheck,
	AssistedOnboarding,
	// Self-Onboarding
	Onboarding,
	OnboardingCompleted,
	OtpVerificationForm,
	RESPONSE_TYPE_IDS,
} from "./page-components";

export type {
	AgentAlreadyExistsScreenProps,
	AgentOnboardingProps,
	AgentStatusCheckProps,
	OnboardingCompletedProps,
	OtpVerificationFormProps,
} from "./page-components";
