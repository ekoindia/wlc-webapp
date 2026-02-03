import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef } from "react";
import StepperItem from "./StepperItem";
import { StepperLayoutProps } from "./types";

/**
 * StepperLayout - Modern responsive layout implementation for the Stepper
 *
 * Orientation behavior:
 * - 'responsive' (default): vertical on ≥md (768px), horizontal on <md
 * - 'horizontal': always horizontal on all screens
 * - 'vertical': always vertical on all screens
 *
 * Features:
 * - Clean minimal design without header/progress bar
 * - Status-colored connectors between steps
 * - Supports icons and step numbers
 * @param {StepperLayoutProps} props - Component props
 * @returns {React.ReactElement} The rendered layout
 */
const StepperLayout: React.FC<StepperLayoutProps> = ({
	state,
	orientation,
	onStepClick,
	allowNavigation,
	children,
}): React.ReactElement => {
	const { visibleSteps, currentStepIndex, isStepCompleted, handleStepClick } =
		state;

	// Determine if we're on mobile for responsive orientation
	const isMobile = useBreakpointValue({ base: true, md: false });

	// Calculate effective orientation based on prop and breakpoint
	const effectiveOrientation = useMemo((): "horizontal" | "vertical" => {
		if (orientation === "responsive") {
			// Responsive: vertical on large screens (≥md), horizontal on small (<md)
			return isMobile ? "horizontal" : "vertical";
		}
		return orientation;
	}, [orientation, isMobile]);

	// Check if any step has an icon
	const hasAnyIcon = useMemo(
		(): boolean => visibleSteps.some((step) => step.icon !== undefined),
		[visibleSteps]
	);

	const isHorizontal = effectiveOrientation === "horizontal";

	// Refs for auto-scrolling
	const stepperContainerRef = useRef<HTMLDivElement>(null);
	const currentStepRefs = useRef<(HTMLDivElement | null)[]>([]);

	// Auto-scroll to current step in horizontal mode
	useEffect(() => {
		if (
			isHorizontal &&
			stepperContainerRef.current &&
			currentStepIndex >= 0
		) {
			const currentStepElement =
				currentStepRefs.current[currentStepIndex];
			if (
				currentStepElement &&
				typeof currentStepElement.scrollIntoView === "function"
			) {
				// Scroll so current step is visible on the left
				currentStepElement.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "start",
				});
			}
		}
	}, [currentStepIndex, isHorizontal]);

	if (visibleSteps.length === 0) {
		return <>{children}</>;
	}

	return (
		<Flex
			direction={isHorizontal ? "column" : "row"}
			w="100%"
			h="auto"
			align="stretch"
			justify="center"
			gap={{ base: 4, md: 10 }}
		>
			{/* Stepper Container */}
			<Flex
				ref={stepperContainerRef}
				direction={isHorizontal ? "row" : "column"}
				w={isHorizontal ? "100%" : { base: "100%", md: "auto" }}
				flexShrink={0}
				align={isHorizontal ? "flex-start" : "stretch"}
				justify={isHorizontal ? "flex-start" : "flex-start"}
				overflowX={isHorizontal ? "auto" : "visible"}
				overflowY="visible"
				scrollSnapType={isHorizontal ? "x proximity" : undefined}
				scrollPaddingLeft={isHorizontal ? 4 : undefined}
				css={
					isHorizontal
						? {
								"&::-webkit-scrollbar": { display: "none" },
								msOverflowStyle: "none",
								scrollbarWidth: "none",
							}
						: undefined
				}
			>
				{visibleSteps.map((step, index) => {
					const isActive = index === currentStepIndex;
					const isCompleted = isStepCompleted(step, index);
					const isClickable =
						allowNavigation &&
						onStepClick !== undefined &&
						isCompleted;

					return (
						<Box
							key={step.id}
							ref={(el) => {
								currentStepRefs.current[index] = el;
							}}
							w={isHorizontal ? "auto" : "100%"}
							scrollSnapAlign={isHorizontal ? "start" : undefined}
						>
							<StepperItem
								step={step}
								index={index}
								isActive={isActive}
								isCompleted={isCompleted}
								showConnector={index < visibleSteps.length - 1}
								hasAnyIcon={hasAnyIcon}
								onClick={() => handleStepClick(step, index)}
								isClickable={isClickable}
								orientation={effectiveOrientation}
							/>
						</Box>
					);
				})}
			</Flex>

			{/* Main Content Area */}
			{children && (
				<Flex flex={1} w="100%" direction="column" overflow="hidden">
					{children}
				</Flex>
			)}
		</Flex>
	);
};

export default StepperLayout;
