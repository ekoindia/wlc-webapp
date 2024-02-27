import { Box, Flex } from "@chakra-ui/react";
import { slideInLeft, slideInRight } from "libs/chakraKeyframes";
import { useEffect, useRef, useState } from "react";
import { IcoButton } from "..";

/**
 * A <XScrollArrow> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<XScrollArrow></XScrollArrow>` TODO: Fix example
 */
const XScrollArrow = ({ children, ...rest }) => {
	const scrollBoxRef = useRef(null);
	const contentBoxRef = useRef(null);

	const [scrollButtonVisibility, setScrollButtonVisibility] = useState({
		showLeftButton: false,
		showRightButton: false,
	});

	const handleScroll = () => {
		const _scrollBox = scrollBoxRef.current;
		const _contentBox = contentBoxRef.current;

		if (_scrollBox) {
			const showLeftButton = _scrollBox.scrollLeft > 30;
			const showRightButton =
				_scrollBox.clientWidth + _scrollBox.scrollLeft <
				_contentBox.clientWidth - 30;
			setScrollButtonVisibility({ showLeftButton, showRightButton });
		}
	};

	useEffect(() => {
		handleScroll();
	}, [contentBoxRef?.current?.clientWidth]);

	return (
		<Flex
			id="XScrollArrowWrapper"
			w="100%"
			pos="relative"
			overflow="hidden"
			align="flex-start"
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
				maxW="100%"
				w="100%"
				overflowX="scroll"
				onScroll={handleScroll}
				css={{
					"&::-webkit-scrollbar": {
						height: "10px",
					},

					"&::-webkit-scrollbar-thumb": {
						background: "#AAA",
						cursor: "pointer",
					},
				}}
			>
				<Box id="contentBox" ref={contentBoxRef} w="max-content">
					{children}
				</Box>
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
