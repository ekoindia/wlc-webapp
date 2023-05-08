import {
	Box,
	Flex,
	Heading,
	Stack,
	StackDivider,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { Button, Cards, IconButtons } from "components";
import Router from "next/router";

const AddressPane = ({ rowData: addressdata }) => {
	const [isSmallerThan769] = useMediaQuery("(max-width:769px)");
	return (
		<Cards>
			<Heading
				fontSize={{ base: 20, md: 15, lg: 17, xl: 18 }}
				fontWeight="semibold"
				color={"light"}
				mt="5px"
			>
				Address Details
			</Heading>
			<Stack
				direction={"column"}
				divider={<StackDivider />}
				mt={{ base: 5, md: 5, xl: 5 }}
			>
				<Box
					mb={{ base: 26, md: 3, xl: 26 }}
					fontSize={{ base: 16, md: 14, lg: 16 }}
				>
					<Text>{addressdata.address}</Text>
				</Box>
				<Box>
					<Box mt={{ base: 26, md: 2, xl: 26 }}>
						<Text
							color="light"
							fontSize={{ base: 14, md: 12, lg: 14 }}
						>
							Ownership type
						</Text>
						<Text
							color="dark"
							fontSize={{ base: 16, md: 14, lg: 16 }}
							fontWeight="medium"
						>
							Owned
						</Text>
					</Box>
					<Box mt={{ base: 8, lg: 5, xl: 8 }} mb={5}>
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.7367686993844!2d77.24740425137843!3d28.547630782365214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3cfc6b8ded5%3A0xce26da05dcf72035!2sEko%20India%20Financial%20Services%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1673455350818!5m2!1sen!2sin"
							width="100%"
							height="200"
						></iframe>
					</Box>
					<Flex
						mt={9}
						justify="space-between"
						align="center"
						direction={{ base: "column", lg: "row" }}
						rowGap="16px"
					>
						<Button
							onClick={() =>
								Router.push(
									"/admin/my-network/profile/up-sell-add"
								)
							}
							w={{ base: "100%", lg: "45%", xl: "189px" }}
							h="60px"
						>
							Update Address
						</Button>
						<Box

						// margin={isSmallerThan769 ? "auto" : ""}
						// mt={isSmallerThan769 ? "24px" : ""}
						// mb={isSmallerThan769 ? "10px" : ""}
						>
							<IconButtons
								title="View on Google Maps"
								variant="accent"
								iconName="near-me"
								iconPos="left"
								iconStyle={{
									width: "16px",
									height: "16px",
								}}
							/>
						</Box>
					</Flex>
				</Box>
			</Stack>
		</Cards>
	);
};

export default AddressPane;
