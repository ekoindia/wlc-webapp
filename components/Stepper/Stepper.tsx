import { Box, Flex, Progress, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import StepperItem from "./StepperItem";
import { STEP_STATUS, StepItem, StepperProps } from "./types";

/**
 * Stepper - A reusable progress stepper component
 *
 * Displays an onboarding/multi-step progress stepper that shows users their
 * current position in a multi-step process. Provides visual feedback for
 * completed, in-progress, skipped, and upcoming steps.
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { id: 1, label: "Step 1", status: STEP_STATUS.COMPLETED, isVisible: true },
 *     { id: 2, label: "Step 2", status: STEP_STATUS.IN_PROGRESS, isVisible: true },
 *     { id: 3, label: "Step 3", status: STEP_STATUS.NOT_STARTED, isVisible: true },
 *   ]}
 *   currentStepId={2}
 *   title="Onboarding Progress"
 * />
 * ```
 * @param {StepperProps} props - Component props
 * @returns {JSX.Element} The rendered stepper component
 */
const Stepper = ({
	steps,
	currentStepId,
	title = "Progress",
	filterConfig,
	onStepClick,
	allowNavigation = false,
	width = { base: "75%", md: "280px" },
	headerBg = "primary.dark",
	headerColor = "white",
	showStepNumbers = true,
	showProgressBar = true,
	statusLabels,
	className = "",
}: StepperProps): JSX.Element => {
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

	if (visibleSteps.length === 0) {
		return <></>;
	}

	return (
		<Flex
			className={className}
			direction="column"
			w={width}
			bg="white"
			borderRadius="10"
			border="card"
			overflow="hidden"
			boxShadow="basic"
		>
			{/* Header section with progress */}
			<Box bg={headerBg} px="5" py="4">
				<Text
					color={headerColor}
					fontSize={{ base: "xs", "2xl": "sm" }}
					fontWeight="semibold"
					textTransform="uppercase"
					letterSpacing="wide"
					mb="3"
				>
					{title}
				</Text>

				{showProgressBar && (
					<>
						<Progress
							value={progressPercentage}
							size="sm"
							colorScheme="green"
							bg="whiteAlpha.300"
							borderRadius="full"
							mb="2"
						/>
						<Text
							color={headerColor}
							fontSize={{ base: "xs", "2xl": "sm" }}
							textAlign="right"
							opacity={0.9}
						>
							{getCompletionText()}
						</Text>
					</>
				)}
			</Box>

			{/* Steps list section */}
			<Flex direction="column" px="5" py="4" gap="0">
				{visibleSteps.map((step, index) => {
					const isActive =
						currentStepId !== undefined
							? step.id === currentStepId
							: index === currentStepIndex;
					const isCompleted = isStepCompleted(step, index);
					const isClickable =
						allowNavigation &&
						onStepClick !== undefined &&
						isCompleted;

					return (
						<StepperItem
							key={step.id}
							step={step}
							index={index}
							isActive={isActive}
							isCompleted={isCompleted}
							showConnector={index < visibleSteps.length - 1}
							showStepNumbers={showStepNumbers}
							onClick={() => handleStepClick(step, index)}
							isClickable={isClickable}
							statusLabels={statusLabels}
						/>
					);
				})}
			</Flex>
		</Flex>
	);
};

export default Stepper;
