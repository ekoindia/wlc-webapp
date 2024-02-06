import { Flex, Text } from "@chakra-ui/react";
import { Icon, ShowcaseCircle } from "components";
import { fadeIn } from "libs/chakraKeyframes";
import { svgBgDotted } from "utils/svgPatterns";

/**
 * A Welcome card with a logo, title and a list of features
 */
const WelcomeCard = ({ logo, header, features = [] }) => {
	return (
		<Flex
			direction="column"
			align="center"
			flex={2}
			display={{ base: "none", md: "flex" }}
			boxShadow="0px 3px 20px #00000005"
			// bg="primary.DEFAULT"
			bgGradient="linear(to-b, primary.light, primary.dark)"
			color="white"
			opacity="0.9"
		>
			<Flex
				w="100%"
				h="100%"
				px={{ base: 5, "2xl": 7 }}
				py={{ base: 7, "2xl": 10 }}
				direction="column"
				align="center"
				justify="space-around"
				backgroundImage={svgBgDotted()}
			>
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
					// align="center"
					opacity="0.9"
					fontSize="0.9em"
					maxW="400px"
					// sx={{ textWrap: "balance" }}
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
		</Flex>
	);
};

export default WelcomeCard;
