import { Box, Flex, keyframes } from "@chakra-ui/react";
import { fadeIn } from "libs/chakraKeyframes";

const animStar = keyframes`
	from {opacity: 0; transform: scale(1.1) rotate(10deg); }
	to {opacity: 1; transform: none;}
`;

const animCircle = keyframes`
	from {opacity: 0; transform: scale(0.8); borderWidth: 0px; }
	to {opacity: 1; transform: none; borderWidth: 25px; }
`;

// const animFadeIn = keyframes`
// 	from {opacity: 0;}
// 	to {opacity: 1;}
// `;

/**
 * A component to show content inside a translucent circular design with optional small stars and patterns
 * @param 	{object}	prop	Properties passed to the component
 * @param	{boolean}	prop.noStars	Don't show stars in the background.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @param prop.imgStars
 * @param prop.children
 * @example	`<ShowcaseCircle></ShowcaseCircle>` TODO: Fix example
 */
const ShowcaseCircle = ({
	noStars = false,
	imgStars = "/stars_bg_250.opt.png",
	children,
	...rest
}) => {
	return (
		<Box w="240px" h="240px" position="relative" {...rest}>
			<Box
				w="240px"
				h="240px"
				position="absolute"
				top="0"
				left="0"
				bottom="0"
				right="0"
				borderRadius="50%"
				bg="#FFFFFF30"
				animation={`${animCircle} ease-out 1.5s`}
			/>
			<Box
				w="190px"
				h="190px"
				position="absolute"
				top="0"
				left="0"
				bottom="0"
				right="0"
				margin="auto"
				borderRadius="50%"
				bg="#FFFFFF90"
				animation={`${animCircle} ease-out 1s`}
				// bgImage="url('/stars_bg_250.opt.png')"
			/>
			{/* Stars */}
			{noStars ? null : (
				<Box
					position="absolute"
					top="0"
					left="0"
					bottom="0"
					right="0"
					bgImage={`url("${imgStars}")`}
					animation={`${animStar} ease-out 5s`}
				/>
			)}
			{/* Content */}
			<Flex
				position="absolute"
				w="190px"
				h="190px"
				top="0"
				left="0"
				bottom="0"
				right="0"
				margin="auto"
				align="center"
				justify="center"
				borderRadius="50%"
				animation={`${fadeIn} ease-out 1.5s`}
			>
				{children}
			</Flex>
		</Box>
	);
};

export default ShowcaseCircle;
