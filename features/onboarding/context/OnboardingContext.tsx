import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { ONBOARDING_STEP_STATUS, type OnboardingStep } from "../constants";
import {
	useOnboardingState,
	type OnboardingStateHook,
} from "../hooks/useOnboardingState";

/**
 * Pipeline execution state for tracking step API calls
 */
export interface PipelineState {
	[_stepId: string]: {
		status: "pending" | "success" | "failed";
		response?: any;
	};
}

/**
 * Extended context value with navigation and pipeline helpers
 */
export interface OnboardingContextValue extends OnboardingStateHook {
	// Pipeline states for smart retry
	pipelineStates: Record<number, PipelineState>;
	setPipelineState: (_stepId: number, _state: PipelineState) => void;

	// Navigation helpers
	currentStepConfig: OnboardingStep | undefined;
	goToStep: (_stepId: number) => void;
	getNextIncompleteStep: () => OnboardingStep | undefined;
	getStepById: (_stepId: number) => OnboardingStep | undefined;

	// Shared data (convenience getters)
	mobile: string;
	agreementId: string;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

interface OnboardingProviderProps {
	children: ReactNode;
	mobile: string;
	agreementId: string;
	/** Optional: pass existing state from parent (for gradual migration) */
	externalState?: {
		state: any;
		dispatch: any;
		actions: any;
	};
}

/**
 * OnboardingProvider
 *
 * Wraps the application to provide onboarding state context.
 * Extends useOnboardingState with navigation helpers and pipeline state tracking.
 * @param {OnboardingProviderProps} props - Component props including children, mobile, agreementId, and optional external state
 * @param {ReactNode} props.children - Child components to be wrapped by the provider
 * @param {string} props.mobile - User mobile number (shared across steps)
 * @param {string} props.agreementId - Agreement ID for esign steps
 * @param {object} [props.externalState] - Optional external state for gradual migration from parent component
 * @returns {JSX.Element} Provider component that wraps children with onboarding context
 */
export const OnboardingProvider = ({
	children,
	mobile,
	agreementId,
	externalState,
}: OnboardingProviderProps) => {
	// Use external state if provided, otherwise create our own
	const internalStateHook = useOnboardingState();
	const { state, dispatch, actions } = externalState || internalStateHook;

	// Pipeline states for tracking API execution per step
	const [pipelineStates, setPipelineStates] = useState<
		Record<number, PipelineState>
	>({});

	/**
	 * Set pipeline state for a specific step
	 * @param {number} stepId - Unique identifier of the onboarding step
	 * @param {PipelineState} pipelineState - Pipeline state object containing API call statuses
	 * @returns {void}
	 */
	const setPipelineState = (stepId: number, pipelineState: PipelineState) => {
		setPipelineStates((prev) => ({
			...prev,
			[stepId]: pipelineState,
		}));
	};

	/**
	 * Get current step configuration
	 */
	const currentStepConfig = useMemo(() => {
		return state.stepperData.find((step) => step.id === state.currentStep);
	}, [state.stepperData, state.currentStep]);

	/**
	 * Navigate to a specific step in the onboarding flow
	 * @param {number} stepId - Unique identifier of the target onboarding step
	 * @returns {void}
	 */
	const goToStep = (stepId: number) => {
		dispatch({ type: "SET_CURRENT_STEP", payload: stepId });
	};

	/**
	 * Get next incomplete step (first step that is not COMPLETED or SKIPPED)
	 * @returns {OnboardingStep | undefined} Next incomplete step or undefined
	 */
	const getNextIncompleteStep = (): OnboardingStep | undefined => {
		return state.stepperData.find(
			(step) =>
				step.stepStatus !== ONBOARDING_STEP_STATUS.COMPLETED &&
				step.stepStatus !== ONBOARDING_STEP_STATUS.SKIPPED
		);
	};

	/**
	 * Get step configuration by ID
	 * @param {number} stepId - Unique identifier of the onboarding step to retrieve
	 * @returns {OnboardingStep | undefined} Step configuration object if found, otherwise undefined
	 */
	const getStepById = (stepId: number): OnboardingStep | undefined => {
		return state.stepperData.find((step) => step.id === stepId);
	};

	const contextValue: OnboardingContextValue = useMemo(
		() => ({
			// Original hook values
			state,
			dispatch,
			actions,

			// Pipeline states
			pipelineStates,
			setPipelineState,

			// Navigation helpers
			currentStepConfig,
			goToStep,
			getNextIncompleteStep,
			getStepById,

			// Shared data
			mobile,
			agreementId,
		}),
		[
			state,
			dispatch,
			actions,
			pipelineStates,
			currentStepConfig,
			mobile,
			agreementId,
			goToStep,
			getNextIncompleteStep,
			getStepById,
		]
	);

	return (
		<OnboardingContext.Provider value={contextValue}>
			{children}
		</OnboardingContext.Provider>
	);
};

/**
 * useOnboardingContext
 *
 * Hook to access onboarding context. Must be used within OnboardingProvider.
 * @returns {OnboardingContextValue} Onboarding context value
 * @throws {Error} If used outside of OnboardingProvider
 */
export const useOnboardingContext = (): OnboardingContextValue => {
	const context = useContext(OnboardingContext);

	if (!context) {
		throw new Error(
			"useOnboardingContext must be used within an OnboardingProvider"
		);
	}

	return context;
};
