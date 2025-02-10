import { Box, Flex, Text } from "@chakra-ui/react";
import { RiImageAddFill } from "react-icons/ri";
import { BsStars } from "react-icons/bs";

const w = "300px";
const h = "200px";

interface LandingPagePreviewProps {
	primary?: string;
	primaryDark?: string;
	accent?: string;
	accentLight?: string;
}

/**
 * Component to show a preview of a website with theme colors and navigation.
 * @component
 * @param {LandingPagePreviewProps} props - Props for configuring the preview.
 * @param {string} [props.primary] - Primary color theme for the preview.
 * @param {string} [props.accent] - Accent color theme for highlighting elements.
 * @param {string} [props.accentLight] - Light variant of the accent color theme.
 */
const LandingPagePreview = ({
	primary,
	accent,
	accentLight,
}: LandingPagePreviewProps): JSX.Element => {
	return (
		<Flex
			direction="row"
			w={w}
			h={h}
			minW={w}
			border="1px solid #999"
			borderRadius={6}
			overflow="hidden"
			fontSize="5px"
			shadow="base"
			pointerEvents="none"
			userSelect="none"
			bg={accentLight}
			bgImage={{
				base: "none",
				lg: "url('/login_bg_2.opt.svg')",
			}}
			backgroundRepeat="no-repeat"
			backgroundPosition="center center"
			backgroundSize="cover"
			transition="background 0.5s ease-in"
		>
			{primary && accent ? (
				<>
					{/* Main Content */}
					<Flex
						direction="row"
						w="100%"
						h="100%"
						flex="1"
						align="center"
						justify="center"
						bg="#00000030"
					>
						{/* Transaction Card */}
						<Flex
							bg="white"
							w="80%"
							h="60%"
							direction="row"
							borderRadius={6}
							shadow="base"
							overflow="hidden"
						>
							<Flex
								flex={2}
								bg={primary}
								align="center"
								justify="center"
								position="relative"
								transition="background 0.5s ease-in"
							>
								<RiImageAddFill size="50%" color="#ffffff50" />
								<Box position="absolute" top="10%" left="5%">
									<BsStars size="30px" color="#ffffff80" />
								</Box>
								<Box
									position="absolute"
									bottom="10%"
									right="15%"
								>
									<BsStars size="15px" color="#ffffff60" />
								</Box>
							</Flex>
							<Flex flex={1} h="100%" direction="column" p="3%">
								<Text
									fontSize="8px"
									fontWeight="700"
									color="#888"
								>
									Logo
								</Text>
								<Box flex="1" />
								<Flex
									direction="row"
									align="center"
									h="10%"
									pl="0.5em"
									border="1px solid #ccc"
									borderRadius={2}
								>
									+91
								</Flex>
								{/* Proceed Button */}
								<Flex
									bg={accent}
									w="100%"
									h="10%"
									my="1.5em"
									align="center"
									justify="center"
									borderRadius={2}
									px="4px"
									color="white"
									fontSize="0.9em"
									transition="background 0.5s ease-in"
								>
									Proceed
								</Flex>
								<Box flex="1" />
							</Flex>
						</Flex>
					</Flex>
				</>
			) : (
				<Box w={w} h={h} />
			)}
		</Flex>
	);
};

export default LandingPagePreview;
