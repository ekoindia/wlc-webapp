import { Badge, Box, Circle, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components/Icon";
import { STEP_STATUS, StepperItemProps } from "./types";

const DEFAULT_STATUS_LABELS = {
	inProgress: "In Progress",
	skipped: "Skipped",
	completed: "Completed",
	failed: "Failed",
};

/**
 * StepperItem - Renders a single step in the stepper with visual states
 *
 * Visual states:
 * - Completed: Green checkmark icon, black text
 * - In Progress: Primary blue text, "In Progress" badge
 * - Skipped: Orange border circle with dash, orange text, "Skipped" badge
 * - Failed: Red border circle with X, red text, "Failed" badge
 * - Disabled/Future: Grayed out appearance, muted text
 * @param {StepperItemProps} props - Component props
 * @returns {JSX.Element} The rendered step item
 */
const StepperItem = ({
	step,
	index,
	isActive,
	isCompleted,
	showConnector,
	showStepNumbers = false,
	onClick,
	isClickable = false,
	statusLabels = DEFAULT_STATUS_LABELS,
}: StepperItemProps): JSX.Element => {
	const { status, label } = step;
	const mergedLabels = { ...DEFAULT_STATUS_LABELS, ...statusLabels };

	// Determine visual state
	const isSkipped = status === STEP_STATUS.SKIPPED;
	const isFailed = status === STEP_STATUS.FAILED;
	const isDisabled = !isCompleted && !isActive && !isSkipped && !isFailed;

	/**
	 * Renders the step indicator (circle with icon/number)
	 * @returns {JSX.Element} Step indicator element
	 */
	const renderStepIndicator = (): JSX.Element => {
		// Completed state - green checkmark
		if (isCompleted) {
			return (
				<Circle
					size={{ base: "24px", "2xl": "28px" }}
					bg="success"
					flexShrink={0}
				>
					<Icon
						name="check"
						color="white"
						size={{ base: "14px", "2xl": "16px" }}
					/>
				</Circle>
			);
		}

		// Active/In Progress state - primary colored circle
		if (isActive) {
			return (
				<Circle
					size={{ base: "24px", "2xl": "28px" }}
					bg="primary.DEFAULT"
					color="white"
					fontSize={{ base: "xs", "2xl": "sm" }}
					fontWeight="semibold"
					flexShrink={0}
				>
					{showStepNumbers ? index + 1 : null}
				</Circle>
			);
		}

		// Skipped state - orange border with dash
		if (isSkipped) {
			return (
				<Circle
					size={{ base: "24px", "2xl": "28px" }}
					border="2px solid"
					borderColor="accent.DEFAULT"
					flexShrink={0}
				>
					<Icon
						name="minus"
						color="accent.DEFAULT"
						size={{ base: "12px", "2xl": "14px" }}
					/>
				</Circle>
			);
		}

		// Failed state - red border with X
		if (isFailed) {
			return (
				<Circle
					size={{ base: "24px", "2xl": "28px" }}
					border="2px solid"
					borderColor="error"
					flexShrink={0}
				>
					<Icon
						name="close"
						color="error"
						size={{ base: "12px", "2xl": "14px" }}
					/>
				</Circle>
			);
		}

		// Disabled/Future state - gray circle with number
		return (
			<Circle
				size={{ base: "24px", "2xl": "28px" }}
				bg="gray.200"
				color="gray.500"
				fontSize={{ base: "xs", "2xl": "sm" }}
				fontWeight="medium"
				flexShrink={0}
			>
				{showStepNumbers ? index + 1 : null}
			</Circle>
		);
	};

	/**
	 * Renders the status badge for active/skipped/failed steps
	 * @returns {JSX.Element | null} Badge element or null
	 */
	const renderStatusBadge = (): JSX.Element | null => {
		if (isActive) {
			return (
				<Badge
					bg="accent.light"
					color="dark"
					fontSize={{ base: "xxs", "2xl": "xs" }}
					fontWeight="medium"
					px="2"
					py="0.5"
					borderRadius="sm"
					textTransform="none"
				>
					{mergedLabels.inProgress}
				</Badge>
			);
		}

		if (isSkipped) {
			return (
				<Badge
					bg="orange.100"
					color="accent.dark"
					fontSize={{ base: "xxs", "2xl": "xs" }}
					fontWeight="medium"
					px="2"
					py="0.5"
					borderRadius="sm"
					textTransform="none"
				>
					{mergedLabels.skipped}
				</Badge>
			);
		}

		if (isFailed) {
			return (
				<Badge
					bg="red.100"
					color="error"
					fontSize={{ base: "xxs", "2xl": "xs" }}
					fontWeight="medium"
					px="2"
					py="0.5"
					borderRadius="sm"
					textTransform="none"
				>
					{mergedLabels.failed}
				</Badge>
			);
		}

		return null;
	};

	/**
	 * Determines the text color based on step state
	 * @returns {string} Chakra color token
	 */
	const getTextColor = (): string => {
		if (isActive) return "primary.DEFAULT";
		if (isSkipped) return "accent.dark";
		if (isFailed) return "error";
		if (isDisabled) return "gray.400";
		return "dark";
	};

	return (
		<Flex
			direction="column"
			position="relative"
			cursor={isClickable ? "pointer" : "default"}
			onClick={isClickable ? onClick : undefined}
			_hover={isClickable ? { opacity: 0.8 } : undefined}
			transition="opacity 0.2s"
		>
			{/* Step content row */}
			<Flex align="flex-start" gap={{ base: "3", "2xl": "4" }}>
				{/* Indicator column with connector line */}
				<Flex direction="column" align="center">
					{renderStepIndicator()}

					{/* Connector line */}
					{showConnector && (
						<Box
							w="2px"
							h={{ base: "24px", "2xl": "28px" }}
							bg={isCompleted ? "success" : "gray.200"}
							mt="1"
						/>
					)}
				</Flex>

				{/* Label and badge column */}
				<Flex
					direction="column"
					gap="1"
					pt="1px"
					minH={
						showConnector ? { base: "48px", "2xl": "56px" } : "auto"
					}
				>
					<Text
						fontSize={{ base: "sm", "2xl": "md" }}
						fontWeight={isActive ? "semibold" : "normal"}
						color={getTextColor()}
						lineHeight="short"
					>
						{label}
					</Text>
					{renderStatusBadge()}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default StepperItem;
