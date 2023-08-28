/**
 * @desc Chakra UI common animation keyframes
 * @example
 * import { fadeIn } from "libs/chakraKeyframes";
 *
 * <Box animation={`${fadeIn} 0.5s ease-out`}>Fading In</Box>
 */

import { keyframes } from "@chakra-ui/react";

export const fadeIn = keyframes`
	from { opacity: 0; }
	to { opacity: 1; }
`;

export const fadeOut = keyframes`
	from { opacity: 1; }
	to { opacity: 0; }
`;

export const slideInLeft = keyframes`
	from { transform: translateX(-100%); }
	to { transform: translateX(0); }
`;

export const slideInRight = keyframes`
	from { transform: translateX(100%); }
	to { transform: translateX(0); }
`;

export const fadeSlideInLeft100 = keyframes`
	from { opacity: 0; transform: translateX(-100%); }
	to { opacity: 1; transform: translateX(0); }
`;

export const fadeSlideInLeft50 = keyframes`
	from { opacity: 0; transform: translateX(-50%); }
	to { opacity: 1; transform: translateX(0); }
`;

export const fadeSlideInRight100 = keyframes`
	from { opacity: 0; transform: translateX(100%); }
	to { opacity: 1; transform: translateX(0); }
`;

export const fadeSlideInRight50 = keyframes`
	from { opacity: 0; transform: translateX(50%); }
	to { opacity: 1; transform: translateX(0); }
`;

export const fadeSlideInBottom100 = keyframes`
	from { opacity: 0; transform: translateY(100%); }
	to { opacity: 1; transform: translateY(0); }
`;

export const fadeSlideInBottom50 = keyframes`
	from { opacity: 0; transform: translateY(50%); }
	to { opacity: 1; transform: translateY(0); }
`;

export const fadeSlideInTop100 = keyframes`
	from { opacity: 0; transform: translateY(-100%); }
	to { opacity: 1; transform: translateY(0); }
`;

export const fadeSlideInTop50 = keyframes`
	from { opacity: 0; transform: translateY(-50%); }
	to { opacity: 1; transform: translateY(0); }
`;
