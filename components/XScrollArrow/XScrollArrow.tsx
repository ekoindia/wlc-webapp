import { Flex } from "@chakra-ui/react";
import { slideInLeft, slideInRight } from "libs/chakraKeyframes";
import { useEffect, useRef, useState } from "react";
import { IcoButton } from "..";

type XScrollArrowProps = {
	children?: React.ReactNode;
	pos?: "top" | "center" | "bottom";
	allowScrollbar?: boolean;
	[x: string]: any;
};

// for the pos prop, we map the values to the corresponding flex alignment
const posMapping: Record<
	XScrollArrowProps["pos"],
	"flex-start" | "center" | "flex-end"
> = {
	top: "flex-start",
	center: "center",
	bottom: "flex-end",
};

/**
 * A XScrollArrow component. This component creates a scrollable area with optional left and right scroll buttons.
 * The scroll buttons appear based on the scroll position.
 * @component
 * @param {object} props - Properties passed to the component
 * @param {React.ReactNode} props.children - React nodes to be rendered inside the scrollable area.
 * @param {"top" | "center" | "bottom"} [props.pos] - Alignment of the scrollable area. Defaults to "top".
 * @param {boolean} [props.allowScrollbar] - Determines whether a scrollbar should be displayed. Defaults to false.
 * @param {...*} rest - Rest of the props passed to this component. These will be spread on the Flex container.
 * @example
 * ```jsx
 * <XScrollArrow pos="center">
 *   <Flex>
 *      <Box>Content 1</Box>
 *      <Box>Content 2</Box>
 *      <Box>Content 3</Box>
 *   </Flex>
 * </XScrollArrow>
 * ```
 * @returns {JSX.Element} The XScrollArrow component.
 */
const XScrollArrow = ({
	children,
	pos = "top",
	allowScrollbar = false,
	...rest
}: XScrollArrowProps): JSX.Element => {
	const scrollBoxRef = useRef<HTMLDivElement>(null);

	const [scrollButtonVisibility, setScrollButtonVisibility] = useState<{
		showLeftButton: boolean;
		showRightButton: boolean;
	}>({
		showLeftButton: false,
		showRightButton: false,
	});

	const handleScroll = () => {
		const _scrollBox = scrollBoxRef.current;

		if (_scrollBox) {
			const showLeftButton = _scrollBox.scrollLeft > 30;
			const showRightButton =
				_scrollBox.clientWidth + _scrollBox.scrollLeft <
				_scrollBox.scrollWidth - 30;
			setScrollButtonVisibility({ showLeftButton, showRightButton });
		}
	};

	useEffect(() => {
		handleScroll();
	}, [scrollBoxRef.current?.scrollWidth]);

	const align = posMapping[pos];

	// if allowScrollbar is true, we set the scrollbar styles
	const scrollbarCSS = allowScrollbar
		? {
				"&::-webkit-scrollbar": {
					height: "10px",
				},
				"&::-webkit-scrollbar-track": {
					background: "#D2D2D2",
				},
				"&::-webkit-scrollbar-thumb": {
					background: "#999999",
				},
			}
		: {
				"&::-webkit-scrollbar": {
					display: "none",
				},
				"&::-moz-scrollbar": {
					display: "none",
				},
				"&::scrollbar": {
					display: "none",
				},
			};

	return (
		<Flex
			id="XScrollArrowWrapper"
			w="100%"
			pos="relative"
			overflow="hidden"
			align={align}
			{...rest}
		>
			{scrollButtonVisibility?.showLeftButton && (
				<IcoButton
					aria-label="Scroll left"
					iconName="chevron-left"
					pos="absolute"
					bg="white"
					color="primary.DEFAULT"
					size="sm"
					zIndex="1"
					rounded="0"
					h="40px"
					w="40px"
					borderRadius="0px 20px 20px 0px"
					boxShadow="0px 5px 10px 0px #00000033"
					animation={`${slideInLeft} 0.2s ease-out`}
					onClick={() => {
						const _scrollBox = scrollBoxRef.current;
						if (_scrollBox) {
							_scrollBox.scrollLeft -= window.innerWidth * 0.6;
						}
						handleScroll();
					}}
				/>
			)}
			<Flex
				id="scrollBox"
				ref={scrollBoxRef}
				w="100%"
				overflowX="auto"
				onScroll={handleScroll}
				css={scrollbarCSS}
				style={{ scrollBehavior: "smooth" }}
			>
				{children}
			</Flex>
			{scrollButtonVisibility?.showRightButton && (
				<IcoButton
					aria-label="Scroll right"
					iconName="chevron-right"
					size="sm"
					right="0"
					bg="white"
					color="primary.DEFAULT"
					zIndex="1"
					pos="absolute"
					rounded="0"
					borderRadius="20px 0px 0px 20px"
					boxShadow="0px 5px 10px 0px #00000033"
					h="40px"
					w="40px"
					animation={`${slideInRight} 0.2s ease-out`}
					onClick={() => {
						const _scrollBox = scrollBoxRef.current;
						if (_scrollBox) {
							_scrollBox.scrollLeft += window.innerWidth * 0.6;
						}
						handleScroll();
					}}
				/>
			)}
		</Flex>
	);
};

export default XScrollArrow;
