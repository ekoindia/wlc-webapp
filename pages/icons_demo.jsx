import { Center, Flex, Text } from "@chakra-ui/react";
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
				{icons.map((ele) => (
					<Center
						key={ele}
						width={"103px"}
						h="55px"
						bg="blackAlpha.300"
						flexDir="column"
					>
						<Icon name={ele} height="24px" />
						<Text fontSize=".5rem">{ele}</Text>
					</Center>
				))}
			</Flex>
		</>
	);
};

export default connecticon;
