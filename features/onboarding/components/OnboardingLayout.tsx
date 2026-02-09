import { Flex } from "@chakra-ui/react";
import { Card } from "components/Card";
import { STEP_STATUS, Stepper } from "components/Stepper";
import {
	StepFilterConfig,
	StepItem,
	StepStatus,
} from "components/Stepper/types";
import { useMemo, type ReactNode } from "react";
import type { OnboardingStep } from "../constants";
import { ONBOARDING_STEP_STATUS } from "../constants";

/**
 * Content type for the right panel
 */
export type ContentType = "form" | "custom" | "widget";

/**
 * Props for the OnboardingLayout component
 */
export interface OnboardingLayoutProps {
	/** Array of step data from onboarding state (stepperData) */
	steps: Array<{
		id: number;
		label: string;
		isVisible: boolean;
		stepStatus: number;
		role?: number;
	}>;
	/** ID of the currently active step */
	currentStepId?: number;
	/** Filter configuration for steps (e.g., exclude certain step IDs for retailers) */
	filterConfig?: StepFilterConfig;
	/** Content to render in the content area */
	children: ReactNode;
	/** Current step configuration (used for determining content type) */
	currentStepConfig?: OnboardingStep;
	/** Custom class name for additional styling */
	className?: string;
}

/**
 * Maps onboarding step status to Stepper STEP_STATUS
 * @param {number} stepStatus - Onboarding step status value
 * @returns {StepStatus} Stepper StepStatus value
 */
const mapStepStatus = (stepStatus: number): StepStatus => {
	switch (stepStatus) {
		case ONBOARDING_STEP_STATUS.COMPLETED:
			return STEP_STATUS.COMPLETED;
		case ONBOARDING_STEP_STATUS.IN_PROGRESS:
			return STEP_STATUS.IN_PROGRESS;
		case ONBOARDING_STEP_STATUS.FAILED:
			return STEP_STATUS.FAILED;
		case ONBOARDING_STEP_STATUS.SKIPPED:
			return STEP_STATUS.SKIPPED;
		case ONBOARDING_STEP_STATUS.NOT_STARTED:
		default:
			return STEP_STATUS.NOT_STARTED;
	}
};

/**
 * OnboardingLayout - Layout component for onboarding flow
 *
 * Renders a responsive layout with the Stepper component showing progress
 * alongside the main content area for forms, custom components, or widgets.
 * @component
 * @param {OnboardingLayoutProps} props - Component props
 * @param {Array} props.steps - Array of step data from onboarding state
 * @param {number} [props.currentStepId] - ID of the currently active step
 * @param {StepFilterConfig} [props.filterConfig] - Configuration for filtering steps
 * @param {ReactNode} props.children - Content to render in the main area
 * @param {OnboardingStep} [props.currentStepConfig] - Current step configuration
 * @param {string} [props.className] - Custom class name for additional styling
 * @returns {JSX.Element} The rendered layout component
 * @example
 * <OnboardingLayout
 *   steps={state.stepperData}
 *   currentStepId={currentStepId}
 *   filterConfig={{ excludeStepIds: [5] }}
 * >
 *   <ContentRenderer
 *     stepConfig={currentStepConfig}
 *     onSubmit={handleSubmit}
 *     onAdvance={handleAdvance}
 *   />
 * </OnboardingLayout>
 */
const OnboardingLayout = ({
	steps,
	currentStepId,
	filterConfig,
	children,
	currentStepConfig: _currentStepConfig,
	className = "",
}: OnboardingLayoutProps): JSX.Element => {
	/**
	 * Transform onboarding steps to Stepper-compatible format
	 */
	const stepperSteps: StepItem[] = useMemo(() => {
		return steps.map((step) => ({
			id: step.id,
			label: step.label,
			status: mapStepStatus(step.stepStatus),
			isVisible: step.isVisible,
		}));
	}, [steps]);

	return (
		<Flex
			className={className}
			overflow="hidden"
			justify="center"
			p={{ base: 2, md: 4 }}
		>
			<Stepper
				steps={stepperSteps}
				currentStepId={currentStepId}
				filterConfig={filterConfig}
			>
				<Card
					flex={1}
					maxW={{ base: "100%", md: "600px" }}
					overflow="hidden"
				>
					{children}
				</Card>
			</Stepper>
		</Flex>
	);
};

export default OnboardingLayout;
