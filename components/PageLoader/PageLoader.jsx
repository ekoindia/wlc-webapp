import { Box, keyframes } from "@chakra-ui/react";

const indeterminateProgress = keyframes`
	from {transform: translateX(-120%); opacity: 0.5}
	to {transform: translateX(100%); opacity: 1}
`;

/**
 * Show page loading animation: an indeterminate progress bar at the top of the page.
 * @example	`{isPageLoading && <PageLoader />}`
 */
const PageLoader = () => {
	return (
		<Box
			position="fixed"
			top={0}
			left={0}
			w="full"
			h="4px"
			// bg="rgba(0,0,0,0.3)"
			zIndex={999999}
		>
			<Box
				bg="accent.light"
				h="full"
				w="full"
				rounded="full"
				animation={`${indeterminateProgress} infinite 2s linear`}
			></Box>
		</Box>
	);
};

export default PageLoader;
