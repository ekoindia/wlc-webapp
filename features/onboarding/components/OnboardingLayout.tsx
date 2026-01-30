import { Box, Flex } from "@chakra-ui/react";
import { Card } from "components/Card";
import { STEP_STATUS, Stepper } from "components/Stepper";
import { StepFilterConfig, StepItem } from "components/Stepper/types";
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
	/** Title for the stepper header */
	stepperTitle?: string;
	/** Filter configuration for steps (e.g., exclude certain step IDs for retailers) */
	filterConfig?: StepFilterConfig;
	/** Content to render in the right panel (Form, Custom Component, or Widget) */
	children: ReactNode;
	/** Current step configuration (used for determining content type) */
	currentStepConfig?: OnboardingStep;
	/** Custom class name for additional styling */
	className?: string;
	/** Whether to show the stepper panel (hide on mobile or specific screens) */
	showStepper?: boolean;
}

/**
 * Maps onboarding step status to Stepper STEP_STATUS
 * @param {number} stepStatus - Onboarding step status value
 * @returns {number} Stepper STEP_STATUS value
 */
const mapStepStatus = (stepStatus: number): number => {
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
 * Renders a two-column layout with:
 * - Left: Stepper component showing progress
 * - Right: Content area for Form, Custom Component, or Widget
 *
 * This component replaces the sidebar from the widget and provides a
 * consistent layout for all onboarding content types.
 * @example
 * ```tsx
 * <OnboardingLayout
 *   steps={state.stepperData}
 *   currentStepId={currentStepId}
 *   stepperTitle="Onboarding Progress"
 *   currentStepConfig={currentStepConfig}
 * >
 *   {currentStepConfig?.localRenderer?.type === "form" ? (
 *     <LocalStepForm stepConfig={currentStepConfig} onSubmit={handleSubmit} />
 *   ) : currentStepConfig?.localRenderer?.type === "custom" ? (
 *     <CustomComponent />
 *   ) : (
 *     <WidgetContent />
 *   )}
 * </OnboardingLayout>
 * ```
 * @param {OnboardingLayoutProps} props - Component props
 * @returns {JSX.Element} The rendered layout component
 */
const OnboardingLayout = ({
	steps,
	currentStepId,
	stepperTitle = "Onboarding Progress",
	filterConfig,
	children,
	currentStepConfig: _currentStepConfig,
	className = "",
	showStepper = true,
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
			direction={{ base: "column", md: "row" }}
			gap={{ base: 4, md: 6 }}
			w="100%"
			h="100%"
			align="flex-start"
			justify="center"
			p={{ base: 4, md: 6 }}
		>
			{/* Left Panel - Stepper */}
			{showStepper && (
				<Box
					display={{ base: "none", md: "block" }}
					flexShrink={0}
					position={{ md: "sticky" }}
					top={{ md: "24px" }}
				>
					<Stepper
						steps={stepperSteps}
						currentStepId={currentStepId}
						title={stepperTitle}
						filterConfig={filterConfig}
						showStepNumbers={true}
						showProgressBar={true}
						width={{ base: "100%", md: "280px" }}
					/>
				</Box>
			)}

			{/* Right Panel - Content Area */}
			<Card
				flex={1}
				maxW={{ base: "100%", md: "600px" }}
				minH={{ base: "auto", md: "500px" }}
				h="auto"
				// p={{ base: 4, md: 6 }}
			>
				{children}
			</Card>
		</Flex>
	);
};

export default OnboardingLayout;
