import { Box, Flex, Text } from "@chakra-ui/react";
import { IcoButton } from "components";
import { svgBgDotted } from "utils/svgPatterns";

/**
 * A Welcome card with a logo, title and a list of features
 * @param {*} props
 * @param {string} props.img Image URL
 * @param {Function} props.onClick Callback function to handle the click event on small-screen Continue button
 */
const ImageCard = ({ img, onClick, ...rest }) => {
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
			>
				<Box
					w="100%"
					h="100%"
					bgImage={`url('${img}')`}
					bgSize="contain"
					bgPosition="center"
					bgRepeat="no-repeat"
				/>

				{onClick !== undefined ? (
					<Flex
						display={{ base: "flex", md: "none" }}
						w="100%"
						justify="flex-end"
						p="4"
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

export default ImageCard;
