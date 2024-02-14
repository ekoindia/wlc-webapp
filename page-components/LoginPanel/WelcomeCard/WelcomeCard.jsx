import { Box, Flex, Text } from "@chakra-ui/react";
import { IcoButton, Icon, ShowcaseCircle } from "components";
import { fadeIn } from "libs/chakraKeyframes";
import { svgBgDotted } from "utils/svgPatterns";

/**
 * A Welcome card with a logo, title and a list of features
 */
const WelcomeCard = ({ logo, header, features = [], onClick, ...rest }) => {
	return (
		<Box
			bgGradient="linear(to-b, primary.light, primary.dark)"
			w="100%"
			h="100%"
			{...rest}
		>
			<Flex
				direction="column"
				align="center"
				flex={2}
				boxShadow="0px 3px 20px #00000005"
				background={{
					base: "url('./bg.svg')",
					md: svgBgDotted(),
				}}
				backgroundSize={{ base: "cover", md: "auto" }}
				w="full"
				h="full"
				color="white"
				opacity={{ base: "1", md: "0.9" }}
				justify="space-around"
				px={{ base: 5, "2xl": 7 }}
				py={{ base: 7, "2xl": 10 }}
			>
				<Flex direction="column" align="center" gap="4">
					{/* Top image box with circles and stars */}
					<ShowcaseCircle>
						<img
							src={logo}
							alt="store"
							width="80px"
							height="80px"
							loading="lazy"
							style={{ pointerEvents: "none" }}
						/>
					</ShowcaseCircle>

					{/* Title */}
					<Text
						fontWeight="bold"
						fontSize="1.4em"
						maxW="400px"
						my={{ base: "1em", md: "1.5em", lg: "2em" }}
						opacity="0.8"
						sx={{ textWrap: "balance" }}
						animation={`${fadeIn} ease-out 2s`}
					>
						{header}
					</Text>

					{/* Feature List */}
					<Flex
						direction="column"
						opacity="0.9"
						fontSize="0.9em"
						maxW="400px"
					>
						{features.map((feature, i) => (
							<Flex
								key={i}
								align="center"
								py="5px"
								animation={`${fadeIn} ease-out 2s`}
							>
								<Icon
									name="check"
									size="18px"
									mr="0.5em"
									border="1px solid #FFF"
									borderRadius="50%"
									padding="2px"
								/>
								<Text textAlign="start">{feature}</Text>
							</Flex>
						))}
					</Flex>
				</Flex>
				{onClick !== undefined ? (
					<Flex
						display={{ base: "flex", md: "none" }}
						w="100%"
						justify="flex-end"
						pr="4"
					>
						<Flex
							align="center"
							gap="2.5"
							onClick={() => onClick()}
						>
							<Text fontWeight="semibold">Continue</Text>
							<IcoButton
								iconName="arrow-forward"
								size="md"
								boxShadow="0px 3px 10px #0000001A"
							/>
						</Flex>
					</Flex>
				) : null}
			</Flex>
		</Box>
	);
};

export default WelcomeCard;
