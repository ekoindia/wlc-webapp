import { useMemo } from "react";
import { STEP_STATUS, StepItem, StepperProps, StepperState } from "./types";

/**
 * useStepperState - Hook to manage the state and logic of the Stepper component
 *
 * Extracts all business logic from the Stepper component including:
 * - Step visibility filtering
 * - Current step resolution
 * - Progress calculation
 * - Completion logic
 * - Navigation handling
 * @param props - Subset of StepperProps containing logic-relevant properties
 * @returns StepperState object with computed values and handlers
 */
export const useStepperState = (
	props: Pick<
		StepperProps,
		| "steps"
		| "currentStepId"
		| "filterConfig"
		| "onStepClick"
		| "allowNavigation"
	>
): StepperState => {
	const {
		steps,
		currentStepId,
		filterConfig,
		onStepClick,
		allowNavigation = false,
	} = props;

	/**
	 * Filter and prepare visible steps based on configuration
	 */
	const visibleSteps = useMemo((): StepItem[] => {
		let filtered = steps.filter((step) => step.isVisible !== false);

		// Apply exclude filter if provided
		if (filterConfig?.excludeStepIds?.length) {
			filtered = filtered.filter(
				(step) => !filterConfig.excludeStepIds?.includes(step.id)
			);
		}

		// Apply custom filter function if provided
		if (filterConfig?.filterFn) {
			filtered = filtered.filter(filterConfig.filterFn);
		}

		return filtered;
	}, [steps, filterConfig]);

	/**
	 * Calculate current step index from the visible steps
	 */
	const currentStepIndex = useMemo((): number => {
		if (currentStepId === undefined) {
			// Find first non-completed step
			const firstPendingIndex = visibleSteps.findIndex(
				(step) =>
					step.status !== STEP_STATUS.COMPLETED &&
					step.status !== STEP_STATUS.SKIPPED
			);
			return firstPendingIndex >= 0 ? firstPendingIndex : 0;
		}
		return visibleSteps.findIndex((step) => step.id === currentStepId);
	}, [currentStepId, visibleSteps]);

	/**
	 * Calculate completion count for display
	 */
	const completedCount = useMemo((): number => {
		return visibleSteps.filter(
			(step) =>
				step.status === STEP_STATUS.COMPLETED ||
				step.status === STEP_STATUS.SKIPPED
		).length;
	}, [visibleSteps]);

	/**
	 * Calculate progress percentage for the progress bar
	 */
	const progressPercentage = useMemo((): number => {
		if (visibleSteps.length === 0) return 0;
		return Math.floor((completedCount / visibleSteps.length) * 100);
	}, [completedCount, visibleSteps.length]);

	/**
	 * Determine if a step is completed (before current step)
	 * @param {StepItem} step - The step to check
	 * @param {number} index - Index of the step
	 * @returns {boolean} Whether the step is completed
	 */
	const isStepCompleted = (step: StepItem, index: number): boolean => {
		return (
			step.status === STEP_STATUS.COMPLETED ||
			(index < currentStepIndex && step.status !== STEP_STATUS.SKIPPED)
		);
	};

	/**
	 * Handle step click for navigation
	 * @param {StepItem} step - The clicked step
	 * @param {number} index - Index of the clicked step
	 */
	const handleStepClick = (step: StepItem, index: number): void => {
		if (onStepClick && (allowNavigation || isStepCompleted(step, index))) {
			onStepClick(step, index);
		}
	};

	/**
	 * Generate completion text with proper pluralization
	 * @returns {string} Formatted completion text
	 */
	const getCompletionText = (): string => {
		const plural = completedCount !== 1 ? "s" : "";
		return `${completedCount} Step${plural} Completed`;
	};

	return {
		visibleSteps,
		currentStepIndex,
		completedCount,
		progressPercentage,
		isStepCompleted,
		handleStepClick,
		getCompletionText,
	};
};
