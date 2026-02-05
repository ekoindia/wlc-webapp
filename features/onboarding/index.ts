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
export {
	createStepLookupMap,
	extractStepConfiguration,
	useAndroidIntegration,
	useEsignIntegration,
	useOnboardingState,
	usePintwinIntegration,
	useStepConfiguration,
	useStepExecutor,
} from "./hooks";

// Context
export {
	OnboardingProvider,
	useOnboardingContext,
	type OnboardingContextValue,
	type PipelineState,
} from "./context";

export type {
	OnboardingAction,
	OnboardingState,
	OnboardingStateHook,
} from "./hooks";

// Utils
export * from "./utils";

// Constants
export {
	APPLICANT_TYPES,
	ONBOARDING_API_STATUS,
	ONBOARDING_STEP_IDS,
	ONBOARDING_STEP_STATUS,
	createRoleSelectionStep,
	filterOnboardingStepsByRoles,
	generateRoleData,
	masterOnboardingSteps,
	roleSelectionStepData,
	visibleAgentTypes,
} from "./constants";

// Types from constants
export type {
	OnboardingApiStatus,
	OnboardingStep,
	OnboardingStepId,
	OnboardingStepStatusType,
	Role,
	RoleConfig,
} from "./constants";

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
