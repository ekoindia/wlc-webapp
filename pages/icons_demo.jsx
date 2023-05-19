import { Center, Circle, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { IconLibrary } from "constants/IconLibrary";

const connecticon = () => {
	const icons = Object.keys(IconLibrary);

	const iconCount = icons.length;

	return (
		<>
			<Text as="h1">Icons: {iconCount}</Text>
			<Flex
				height={"auto"}
				wrap="wrap"
				rowGap={"10px"}
				columnGap="11px"
				padding={"20px"}
			>
				{icons.map((ele) => {
					return (
						<Center
							key={ele}
							width={"103px"}
							h="65px"
							bg={
								IconLibrary[ele]?.link
									? "#99000050"
									: "blackAlpha.300"
							}
							flexDir="column"
						>
							<Circle p="2" m="1" bg="white" borderRadius="50%">
								<Icon name={ele} size="20px" />
							</Circle>
							<Text fontSize=".5rem">
								{ele +
									(IconLibrary[ele]?.link
										? "  (→  " +
										  IconLibrary[ele]?.link +
										  ")"
										: "")}
							</Text>
						</Center>
					);
				})}
			</Flex>
		</>
	);
};

export default connecticon;
