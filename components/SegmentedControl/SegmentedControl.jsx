import { Box, HStack, Icon, Text, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Segmented Control
 * @param {object} props - Component props
 * @param {string} [props.name] - Name for the control (for accessibility)
 * @param {Array<{
 *   id?: string,
 *   value: string,
 *   label?: string,
 *   icon?: React.ElementType | React.ReactNode,
 *   ariaLabel?: string
 * }>} props.segments - Segment definitions. If label is omitted, renders icon-only pill.
 * @param {(value: string, index: number) => void} [props.onChange] - Callback when selection changes
 * @param {number} [props.defaultIndex] - Uncontrolled initial index
 * @param {string} [props.value] - Controlled value (optional)
 * @param {boolean} [props.equalWidth] - Make all segments equal width
 * @param {string} [props.minSegmentWidth] - Minimum segment width
 * @param {"sm"|"md"|"lg"} [props.size] - Size of the control
 * @param {string} [props.color] - Color of the active segment background
 * @param {string} [props.bg] - Background color of the control
 * @param {string} [props.activeTextColor] - Text color of the active segment
 * @param {string} [props.inactiveTextColor] - Text color of the inactive segments
 * @param {boolean} [props.showDividers] - Show subtle vertical dividers between segments
 * @param {string} [props.dividerColor] - Color of the dividers
 * @param {string} [props.radius] - Border radius of the control (overrides size-based radius)
 * @param {string} [props.innerRadius] - Border radius of the inner part of the control (overrides size-based inner radius)
 * @param {boolean} [props.hideLabelsOnMobile] - Hide segment labels on mobile devices
 * @param {object} [props.segmentProps] - Additional props to pass to each segment
 * @param {object} [props.activeProps] - Additional props to pass to the active segment highlight
 * @returns {JSX.Element} Segmented control component
 */
export default function SegmentedControl({
	name,
	segments = [],
	onChange,
	defaultIndex = 0,
	value,
	equalWidth = false,
	minSegmentWidth = "120px",
	size = "md",
	color = "primary.DEFAULT",
	bg = "white",
	activeTextColor = "white",
	inactiveTextColor = "gray.600",
	showDividers = false,
	dividerColor = "gray.300",
	radius,
	innerRadius,
	hideLabelsOnMobile = false,
	segmentProps = {},
	activeProps = {},
	...rest
}) {
	const containerRef = useRef(null);
	const segRefs = useRef([]);
	const [ready, setReady] = useState(false);
	const [activeIndex, setActiveIndex] = useState(defaultIndex);
	const [computedIndex, setComputedIndex] = useState(defaultIndex || 0);
	const [highlight, setHighlight] = useState({ width: 0, x: 0 });

	const isSmallScreen = useBreakpointValue(
		{ base: true, md: false },
		{ ssr: false }
	);

	const hideLabel = hideLabelsOnMobile && isSmallScreen;

	// Controlled vs uncontrolled
	useEffect(() => {
		if (value == null) return activeIndex;
		const idx = segments.findIndex((s) => s.value === value);
		if (idx >= 0 && idx !== computedIndex) setComputedIndex(idx);
	}, [value, activeIndex, segments]);

	const sizes = {
		sm: {
			height: "32px",
			padX: "10px",
			font: "xs",
			heightInset: "3px",
			radius: "6px",
			innerRadius: "4px",
		},
		md: {
			height: "40px",
			padX: "14px",
			font: "sm",
			heightInset: "3px",
			radius: "8px",
			innerRadius: "6px",
		},
		lg: {
			height: "48px",
			padX: "18px",
			font: "md",
			heightInset: "4px",
			radius: "8px",
			innerRadius: "6px",
		},
	};
	const s = sizes[size] || sizes.md;

	const renderIcon = (ic) => {
		if (!ic) return null;
		return React.isValidElement(ic) ? ic : <Icon as={ic} boxSize="1em" />;
	};

	// Measure active segment and update highlight
	const measure = (computedIndex) => {
		const el = segRefs.current[computedIndex];
		const container = containerRef.current;
		if (!el || !container) return;
		const width = el.offsetWidth;
		const x = el.offsetLeft;
		setHighlight({ width, x });
	};

	// Update highlight on segment change
	useLayoutEffect(() => {
		measure(computedIndex);
	}, [computedIndex, segments.length]);

	// Component Init: set up resize observer
	useEffect(() => {
		setReady(true);
		const onResize = () => measure();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	// Handle segment selection
	const handleSelect = (idx) => {
		if (value == null) setActiveIndex(idx); // uncontrolled mode
		onChange?.(segments[idx].value, idx);
	};

	return (
		<Box
			ref={containerRef}
			role="radiogroup"
			aria-label={name}
			display="inline-flex"
			justifyContent="space-between"
			bg={bg}
			boxShadow="sm"
			borderRadius={radius || s.radius}
			height={s.height}
			// p={s?.heightInset || 3}
			overflow="hidden"
			position="relative"
			// CSS vars for highlight position & width
			sx={{
				"--highlight-width": `${highlight.width}px`,
				"--highlight-x-pos": `${highlight.x}px`,
			}}
			_before={{
				content: '""',
				bg: color,
				borderRadius: radius || s.innerRadius || s.radius,
				width: `calc( var(--highlight-width) - (${s.heightInset} * 2) )`,
				transform: "translateX(var(--highlight-x-pos))",
				position: "absolute",
				top: s.heightInset,
				bottom: s.heightInset,
				left: s.heightInset,
				zIndex: 0,
				transition: ready
					? "transform 0.2s ease-out, width 0.2s ease-out"
					: "none",
				...activeProps,
			}}
			{...rest}
		>
			<HStack spacing={0}>
				{segments.map((seg, i) => {
					const isActive = i === computedIndex;
					const isNextActive = i + 1 === computedIndex;
					const iconOnly = (hideLabel || !seg.label) && !!seg.icon;
					const showDividerAfter =
						showDividers &&
						i < segments.length - 1 &&
						!isActive &&
						!isNextActive;

					return (
						<React.Fragment key={seg.id || seg.value}>
							<Box
								ref={(el) => (segRefs.current[i] = el)}
								role="radio"
								aria-checked={isActive}
								tabIndex={isActive ? 0 : -1}
								onClick={() => handleSelect(i)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										handleSelect(i);
								}}
								zIndex={1}
								px={iconOnly ? s.padX : s.padX}
								minW={iconOnly ? undefined : minSegmentWidth}
								height="full"
								display="flex"
								alignItems="center"
								justifyContent="center"
								textAlign="center"
								fontWeight="500"
								fontSize={s.font}
								cursor="pointer"
								color={
									isActive
										? activeTextColor
										: inactiveTextColor
								}
								transition="color	 0.2s ease-out"
								flex={equalWidth ? 1 : "unset"}
								userSelect="none"
								outline="none"
								_focusVisible={{ boxShadow: "outline" }}
								title={
									iconOnly
										? seg.ariaLabel || seg.value
										: undefined
								}
								{...segmentProps}
							>
								<HStack
									spacing={
										seg.label && seg.icon && !iconOnly
											? 2
											: 0
									}
									justify="center"
								>
									{seg.icon && renderIcon(seg.icon)}
									{seg.label && !iconOnly ? (
										<Text as="span" noOfLines={1}>
											{seg.label}
										</Text>
									) : null}
								</HStack>
							</Box>
							<Box
								w="1px"
								bg={
									showDividerAfter
										? dividerColor
										: "transparent"
								}
								height={`calc(100% - ${typeof s.heightInset === "string" ? s.heightInset : `${s.heightInset * 4}px`} * 2)`}
								alignSelf="center"
								zIndex={1}
								opacity={0.6}
								transition="background 0.2s ease-out"
							/>
						</React.Fragment>
					);
				})}
			</HStack>
		</Box>
	);
}
