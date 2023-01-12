import { Heading, Stack, StackDivider } from "@chakra-ui/react";
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
			></Stack>
		</Cards>
	);
};

export default ContactPane;
