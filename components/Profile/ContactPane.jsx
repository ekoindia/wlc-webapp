import { Box, Heading, Stack, StackDivider, Text } from "@chakra-ui/react";
import { Cards } from "../";

const ContactPane = () => {
	return (
		<Cards h="365px">
			<Heading fontSize={18} fontWeight="semibold" color={"light"}>
				Contact information
			</Heading>
			<Stack
				direction={"column"}
				divider={<StackDivider />}
				mt={"5"}
				fontSize={14}
			>
				<Box display={"flex"}>
					<Text>Date of birth:</Text>
					<Text fontWeight={"medium"}>&nbsp; 06/02/1989</Text>
				</Box>
				<Box display={"flex"}>
					<Text>Gender:</Text>
					<Text fontWeight={"medium"}>&nbsp; Male</Text>
				</Box>
				<Box display={"flex"}>
					<Text>Shop name:</Text>
					<Text fontWeight={"medium"}>&nbsp; Alam Store</Text>
				</Box>
			</Stack>
		</Cards>
	);
};

export default ContactPane;
