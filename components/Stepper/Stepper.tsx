import StepperLayout from "./StepperLayout";
import { StepperProps } from "./types";
import { useStepperState } from "./useStepperState";

/**
 * Stepper - A modern, reusable progress stepper component
 *
 * Displays a multi-step progress indicator showing users their current position
 * in a multi-step process. Provides visual feedback for completed, in-progress,
 * skipped, failed, and not-started steps.
 * @component
 * @param {StepperProps} props - Component props
 * @param {StepItem[]} props.steps - Array of step objects with id, label, status, and optional icon/description
 * @param {number | string} [props.currentStepId] - ID of the currently active step (auto-detected if omitted)
 * @param {StepFilterConfig} [props.filterConfig] - Configuration for filtering visible steps
 * @param {Function} [props.onStepClick] - Callback when a step is clicked
 * @param {boolean} [props.allowNavigation] - Whether to allow clicking on completed steps to navigate back
 * @param {StepperOrientation} [props.orientation] - Orientation: 'responsive' (vertical on ≥md, horizontal on <md), 'horizontal', or 'vertical'
 * @param {React.ReactNode} [props.children] - Content to render alongside the stepper
 * @returns {JSX.Element} The rendered stepper component
 * @example
 * // Basic usage with icons
 * <Stepper
 *   steps={[
 *     { id: 1, label: "Address", description: "Add your address", status: STEP_STATUS.COMPLETED, icon: "location" },
 *     { id: 2, label: "Shipping", status: STEP_STATUS.IN_PROGRESS, icon: "truck" },
 *     { id: 3, label: "Payment", status: STEP_STATUS.NOT_STARTED, icon: "card" },
 *   ]}
 *   currentStepId={2}
 *   orientation="responsive"
 * >
 *   <MyContent />
 * </Stepper>
 */
const Stepper = (props: StepperProps): JSX.Element => {
	const {
		steps,
		currentStepId,
		filterConfig,
		onStepClick,
		allowNavigation = false,
		orientation = "responsive",
		children,
	} = props;

	// Extract business logic to hook
	const state = useStepperState({
		steps,
		currentStepId,
		filterConfig,
		onStepClick,
		allowNavigation,
	});

	return (
		<StepperLayout
			state={state}
			orientation={orientation}
			onStepClick={onStepClick}
			allowNavigation={allowNavigation}
		>
			{children}
		</StepperLayout>
	);
};

export default Stepper;
