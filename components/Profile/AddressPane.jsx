import {
	Box,
	Flex,
	Heading,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { Buttons, Cards, IconButtons } from "../";

const AddressPane = () => {
	return (
		<Cards>
			<Heading fontSize={18} fontWeight="semibold" color={"light"}>
				Address Details
			</Heading>
			<Stack direction={"column"} divider={<StackDivider />} mt={"5"}>
				<Box mb={26}>
					<Text>A 615, Gali No. 8, Jaitpur Extension Part 2</Text>
					<Text>Badarpur, New Delhi</Text>
					<Text>110044</Text>
				</Box>
				<Box>
					<Box mt={26}>
						<Text color="light" fontSize={14}>
							Ownership type
						</Text>
						<Text color="dark" fontSize={16} fontWeight="medium">
							Owned
						</Text>
					</Box>
					<Box mt={8} mb={5}>
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.7367686993844!2d77.24740425137843!3d28.547630782365214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3cfc6b8ded5%3A0xce26da05dcf72035!2sEko%20India%20Financial%20Services%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1673455350818!5m2!1sen!2sin"
							width="100%"
							height="200"
						></iframe>
					</Box>
					<Flex
						mt={9}
						justify={"space-between"}
						align={"center"}
						wrap={"wrap"}
					>
						<Buttons w="189px" h="60px" title="Update Address" />
						<IconButtons
							title="View on Google Maps"
							colorType="0"
							iconName="near-me"
							iconPos="left"
							fontSize="md"
							iconStyle={{ w: "11px", h: "11px" }}
						/>
					</Flex>
				</Box>
			</Stack>
		</Cards>
	);
};

export default AddressPane;
