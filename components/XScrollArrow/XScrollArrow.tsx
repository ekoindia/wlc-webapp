import { Flex } from "@chakra-ui/react";
import { slideInLeft, slideInRight } from "libs/chakraKeyframes";
import { useEffect, useRef, useState } from "react";
import { IcoButton } from "..";

type XScrollArrowProps = {
	children?: React.ReactNode;
	pos?: "flex-start" | "center" | "flex-end";
	[x: string]: any;
};

/**
 * A XScrollArrow component. This component creates a scrollable area with optional left and right scroll buttons.
 * The scroll buttons appear based on the scroll position.
 *
 * @param 	{object}	props	Properties passed to the component
 * @param	{React.ReactNode}	props.children	React nodes to be rendered inside the scrollable area.
 * @param	{"flex-start" | "center" | "flex-end"}	props.pos	Alignment of the scrollable area. Defaults to "flex-start".
 * @param	{...*}	rest	Rest of the props passed to this component. These will be spread on the Flex container.
 *
 * @example
 * ```jsx
 * <XScrollArrow pos="center">
 *   <div>Content 1</div>
 *   <div>Content 2</div>
 *   <div>Content 3</div>
 * </XScrollArrow>
 * ```
 */
const XScrollArrow = ({
	children,
	pos = "flex-start",
	...rest
}: XScrollArrowProps): JSX.Element => {
	const contentBoxRef = useRef<HTMLDivElement>(null);

	const [scrollButtonVisibility, setScrollButtonVisibility] = useState<{
		showLeftButton: boolean;
		showRightButton: boolean;
	}>({
		showLeftButton: false,
		showRightButton: false,
	});

	const handleScroll = () => {
		const _contentBox = contentBoxRef.current;

		if (_contentBox) {
			const showLeftButton = _contentBox.scrollLeft > 30;
			const showRightButton =
				_contentBox.clientWidth + _contentBox.scrollLeft <
				_contentBox.scrollWidth - 30;
			setScrollButtonVisibility({ showLeftButton, showRightButton });
		}
	};

	useEffect(() => {
		handleScroll();
	}, [contentBoxRef.current?.scrollWidth]);

	return (
		<Flex
			id="XScrollArrowWrapper"
			w="100%"
			pos="relative"
			overflow="hidden"
			align={pos}
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
						const _contentBox = contentBoxRef.current;
						if (_contentBox) {
							_contentBox.scrollLeft -= window.innerWidth * 0.6;
						}
						handleScroll();
					}}
				/>
			)}
			<Flex
				id="contentBox"
				ref={contentBoxRef}
				w="100%"
				overflowX="auto"
				onScroll={handleScroll}
				{...rest}
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
						const _contentBox = contentBoxRef.current;
						if (_contentBox) {
							_contentBox.scrollLeft += window.innerWidth * 0.6;
						}
						handleScroll();
					}}
				/>
			)}
		</Flex>
	);
};

export default XScrollArrow;
