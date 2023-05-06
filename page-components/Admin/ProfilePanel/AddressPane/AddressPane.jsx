import {
	Box,
	Flex,
	Heading,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { Button, Cards, IconButtons } from "components";
import { openGoogleMap } from "helpers";
import { Map } from "libs";
import Router from "next/router";

const AddressPane = ({ rowdata: addressdata }) => {
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
							{addressdata.ownership_type}
						</Text>
					</Box>
					<Box mt={{ base: 8, lg: 5, xl: 8 }} mb={5} height="200px">
						<Map
							lat={addressdata.lattitude}
							lng={addressdata.longitude}
						/>
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
						<Box>
							<IconButtons
								title="View on Google Maps"
								variant="accent"
								iconName="near-me"
								iconPos="left"
								iconStyle={{
									width: "16px",
									height: "16px",
								}}
								onClick={() =>
									openGoogleMap(
										addressdata.lattitude,
										addressdata.longitude
									)
								}
							/>
						</Box>
					</Flex>
				</Box>
			</Stack>
		</Cards>
	);
};

export default AddressPane;
