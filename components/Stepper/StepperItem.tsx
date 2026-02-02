import { Box, Circle, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components/Icon";
import { isValidElement, ReactNode } from "react";
import { DEFAULT_STATUS_COLORS, STEP_STATUS, StepperItemProps } from "./types";

const CONNECTOR_WIDTH = "2px";
const CONNECTOR_HEIGHT = { base: "24px", "2xl": "32px" };
const CONNECTOR_COLOR = "hint";

/**
 * StepperItem - Renders a single step in the stepper with visual states
 *
 * Visual states (indicated by background/border color):
 * - Completed: success color background
 * - In Progress: primary color background
 * - Skipped: hint color background
 * - Failed: error color background
 * - Not Started: shade color background
 *
 * Indicator content:
 * - If no step has icons: shows step number (1, 2, 3...)
 * - If any step has icons: shows icon or empty circle
 * - On hover: shows status icon (✓ for completed, — for skipped, ✗ for failed)
 * @param {StepperItemProps} props - Component props
 * @returns {JSX.Element} The rendered step item
 */
const StepperItem = ({
	step,
	index,
	isActive,
	isCompleted,
	showConnector,
	hasAnyIcon,
	onClick,
	isClickable = false,
	orientation,
}: StepperItemProps): JSX.Element => {
	const { status, label, description, icon } = step;

	// Determine visual state
	const isSkipped = status === STEP_STATUS.SKIPPED;
	const isFailed = status === STEP_STATUS.FAILED;
	const isNotStarted = status === STEP_STATUS.NOT_STARTED;
	const isInProgress = isActive || status === STEP_STATUS.IN_PROGRESS;

	/**
	 * Gets the background color based on step status
	 * @returns {string} Chakra color token
	 */
	const getStatusColor = (): string => {
		if (isCompleted) return DEFAULT_STATUS_COLORS.completed;
		if (isFailed) return DEFAULT_STATUS_COLORS.failed;
		if (isSkipped) return DEFAULT_STATUS_COLORS.skipped;
		if (isInProgress) return DEFAULT_STATUS_COLORS.inProgress;
		return DEFAULT_STATUS_COLORS.notStarted;
	};

	/**
	 * Gets the text color for the indicator content
	 * @returns {string} Chakra color token
	 */
	const getIndicatorTextColor = (): string => {
		if (isInProgress) return "white";
		if (isNotStarted) return "gray.500";
		if (isSkipped) return "gray.600";
		return "white";
	};

	/**
	 * Gets the hover status icon name based on step status
	 * @returns {string} Icon name
	 */
	const getHoverIconName = (): string => {
		if (isCompleted) return "check-circle";
		if (isSkipped) return "radio-button-checked";
		if (isFailed) return "error";
		return "radio-button-unchecked";
	};

	/**
	 * Renders the icon inside the indicator
	 * @returns {ReactNode} Icon element
	 */
	const renderIcon = (): ReactNode => {
		if (!icon) return null;

		// If icon is a ReactNode (component), render it directly
		if (isValidElement(icon)) {
			return icon;
		}

		// If icon is a string, render using Icon component
		if (typeof icon === "string") {
			return (
				<Icon
					name={icon}
					color={getIndicatorTextColor()}
					size={{ base: "18px", "2xl": "22px" }}
				/>
			);
		}

		return null;
	};

	/**
	 * Renders the default indicator content (number or empty circle)
	 * @returns {ReactNode} Default indicator content
	 */
	const renderDefaultContent = (): ReactNode => {
		if (hasAnyIcon) {
			// If any step has icons but this one doesn't, show empty
			return null;
		}

		// Show step number
		return (
			<Text
				fontSize={{ base: "md", "2xl": "lg" }}
				fontWeight="semibold"
				color={getIndicatorTextColor()}
				lineHeight="1"
			>
				{index + 1}
			</Text>
		);
	};

	/**
	 * Renders the step indicator (circle with icon/number)
	 * @returns {JSX.Element} Step indicator element
	 */
	const renderStepIndicator = (): JSX.Element => {
		const statusColor = getStatusColor();
		const hoverIcon = getHoverIconName();
		const hasHoverIcon = Boolean(hoverIcon);

		return (
			<Circle
				size={{ base: "40px", "2xl": "48px" }}
				bg={statusColor}
				flexShrink={0}
				position="relative"
				transition="all 0.2s ease"
				role="group"
			>
				{/* Default content (icon or number) */}
				<Flex
					align="center"
					justify="center"
					transition="opacity 0.2s ease"
					_groupHover={hasHoverIcon ? { opacity: 0 } : undefined}
				>
					{icon ? renderIcon() : renderDefaultContent()}
				</Flex>

				{/* Hover state - show status icon */}
				{hasHoverIcon && (
					<Flex
						position="absolute"
						inset="0"
						align="center"
						justify="center"
						opacity={0}
						transition="opacity 0.2s ease"
						_groupHover={{ opacity: 1 }}
					>
						<Icon
							name={hoverIcon}
							color={getIndicatorTextColor()}
							size={{ base: "18px", "2xl": "22px" }}
						/>
					</Flex>
				)}
			</Circle>
		);
	};

	const isHorizontal = orientation === "horizontal";

	return (
		<Flex
			direction="column"
			align={isHorizontal ? "center" : "flex-start"}
			w={isHorizontal ? "auto" : "100%"}
			minW={isHorizontal ? "80px" : "auto"}
			textAlign={isHorizontal ? "center" : "left"}
			position="relative"
			cursor={isClickable ? "pointer" : "default"}
			onClick={isClickable ? onClick : undefined}
			_hover={isClickable ? { opacity: 0.8 } : undefined}
			transition="opacity 0.2s"
			flex={isHorizontal ? 1 : "none"}
		>
			{/* Step content */}
			<Flex
				align="center"
				direction={isHorizontal ? "column" : "row"}
				gap={{ base: 3, "2xl": 4 }}
				w="100%"
			>
				{/* Indicator with connector */}
				{isHorizontal ? (
					<Flex direction="row" align="center" w="100%">
						{/* Connector before (horizontal) - invisible spacer for first item */}
						<Box
							flex={1}
							h={index > 0 ? CONNECTOR_WIDTH : 0}
							bg={index > 0 ? CONNECTOR_COLOR : "transparent"}
							transition="background 0.2s ease"
						/>

						{renderStepIndicator()}

						{/* Connector after (horizontal) - invisible spacer for last item */}
						<Box
							flex={1}
							h={showConnector ? CONNECTOR_WIDTH : 0}
							bg={showConnector ? CONNECTOR_COLOR : "transparent"}
							transition="background 0.2s ease"
						/>
					</Flex>
				) : (
					<Flex direction="column" align="center" flexShrink={0}>
						{/* Connector before (vertical) */}
						{index > 0 ? (
							<Box
								w={CONNECTOR_WIDTH}
								h={CONNECTOR_HEIGHT}
								bg={CONNECTOR_COLOR}
								transition="background 0.2s ease"
							/>
						) : (
							<Box h={CONNECTOR_HEIGHT} />
						)}

						{renderStepIndicator()}

						{/* Connector after (vertical) */}
						{showConnector ? (
							<Box
								w={CONNECTOR_WIDTH}
								h={CONNECTOR_HEIGHT}
								bg={CONNECTOR_COLOR}
								transition="background 0.2s ease"
							/>
						) : (
							<Box h={CONNECTOR_HEIGHT} />
						)}
					</Flex>
				)}

				{/* Label and description */}
				<Flex
					direction="column"
					gap="1"
					pt={isHorizontal ? 2 : 0}
					align={isHorizontal ? "center" : "flex-start"}
					w={isHorizontal ? "100%" : "auto"}
					px={isHorizontal ? 1 : 0}
				>
					<Text
						fontSize={{ base: "xs", "2xl": "sm" }}
						fontWeight={isInProgress ? "semibold" : "medium"}
						color="dark"
						lineHeight="short"
						textAlign={isHorizontal ? "center" : "left"}
						noOfLines={isHorizontal ? 2 : undefined}
						wordBreak="break-word"
					>
						{label}
					</Text>

					{description && !isHorizontal && (
						<Text
							fontSize={{ base: "xs", "2xl": "sm" }}
							color="light"
							lineHeight="short"
						>
							{description}
						</Text>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default StepperItem;
