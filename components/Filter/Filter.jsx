import React from "react";

import {
	Box,
	Button,
	Center,
	Checkbox,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	Grid,
	GridItem,
	Input,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { Buttons, Icon, IconButtons } from "..";

function Filter() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	return (
		<>
			<Button
				my={"1vw"}
				display={"flex"}
				justifyContent={"space-evenly"}
				alignItems={"center"}
				ref={btnRef}
				onClick={onOpen}
				h={{
					base: "8.5vw",
					sm: "5vw",
					md: "4vw",
					lg: "3vw",
					xl: "2.5vw",
					"2xl": "2vw",
				}}
				w={{
					base: "8vw",
					sm: "12vw",
					md: "10vw",
					lg: "7vw",
					xl: "7vw",
					"2xl": "6vw",
				}}
				bg="#FFFFFF"
				color="#11299E"
				border="1px solid #11299E"
				boxShadow=" 0px 3px 10px #11299E1A"
				borderRadius="10"
				_hover={{
					bg: "white",
				}}
				_active={{
					bg: "white",
				}}
			>
				<Center
					width={{
						base: "10px",
						sm: "12px",
						md: "12px",
						lg: "14px",
						xl: "16px",
						"2xl": "20px",
					}}
					height={{
						base: "10px",
						sm: "12px",
						md: "12px",
						lg: "14px",
						xl: "16px",
						"2xl": "20px",
					}}
					mr={"2px"}
				>
					<Icon name="filter" />
				</Center>
				<Text
					as="span"
					color="#11299E"
					fontSize={{
						base: "5px",
						sm: "xs",
						md: "xs",
						lg: "xs",
						xl: "sm",
						"2xl": "xl",
					}}
					lineHeight={"0"}
				>
					Filter
				</Text>
			</Button>

			<Drawer
				isOpen={isOpen}
				placement="right"
				onClose={onClose}
				finalFocusRef={btnRef}
				size={"md"}
			>
				<DrawerOverlay bg="#e9edf1b3" backdropFilter="blur(6px)" />
				<DrawerContent>
					<DrawerHeader py="3.43rem" pl="3.125rem">
						<Box display={"flex"} justifyContent={"space-between"}>
							<Box
								display={"flex"}
								alignItems={"center"}
								fontWeight={"semibold"}
								fontSize="30px"
								lineHeight="0px"
							>
								<Icon
									name="filter"
									width="40px"
									height="25px"
									// size={"30px"}
									style={{ marginRight: ".3rem" }}
								/>
								Filter
							</Box>
							<Box
								display={"flex"}
								alignItems={"center"}
								onClick={onClose}
								fontSize="18px"
								cursor={"pointer"}
								color={"light"}
								lineHeight="0px"
							>
								<Icon
									name="close-outline"
									width="24px"
									height="24px"
									style={{ marginRight: ".3rem" }}
								/>
								Close
							</Box>
							{/* //TODO update this to button after updating buttons to accept multiple colors */}
						</Box>
					</DrawerHeader>

					<DrawerBody pl="3.125rem">
						<Box mt={2}>
							<Text
								color="light"
								fontWeight="semibold"
								fontSize="lg"
							>
								Filter by profile type
							</Text>
							<Grid
								templateColumns="repeat(2, 1fr)"
								mt="5"
								gap="2"
							>
								<GridItem w="100%">
									<Checkbox variant="rounded">
										Merchant
									</Checkbox>
								</GridItem>
								<GridItem w="100%">
									<Checkbox variant="rounded">
										Seller
									</Checkbox>
								</GridItem>
							</Grid>
						</Box>

						<Box mt={16}>
							<Text
								color={"light"}
								fontWeight={"semibold"}
								fontSize="lg"
							>
								Filter by account status
							</Text>
							<Grid
								templateColumns="repeat(2, 1fr)"
								mt="5"
								gap="2"
							>
								<GridItem w="100%">
									<Checkbox
										variant="rounded"
										borderRadius="20px"
									>
										Active
									</Checkbox>
								</GridItem>
								<GridItem w="100%">
									<Checkbox variant="rounded">
										Inactive
									</Checkbox>
								</GridItem>
							</Grid>
						</Box>

						<Box mt={16}>
							<Text
								color={"light"}
								fontWeight={"semibold"}
								fontSize="lg"
							>
								Filter by activation date range
							</Text>
							<Flex wrap={"wrap"} mt="5">
								<Input
									w={"52"}
									size="md"
									type="date"
									borderRight="none"
									borderRightRadius="none"
									// min="1970-01-01"
									// max="2100-12-31"
									placeholder="From"
								/>
								<Input
									borderLeftRadius="none"
									w={"52"}
									size="md"
									type="date"
									min="1970-01-01"
									max="2100-12-31"
								/>
							</Flex>
						</Box>

						<Box
							display={"flex"}
							justifyContent={"flex-end"}
							gap={16}
							mt={44}
						>
							<IconButtons
								title="Clear All"
								colorType="0"
								textStyle={{
									fontSize: "20px",
								}}
							></IconButtons>
							<Buttons
								w="118px"
								h="64px"
								fontSize="20px"
								title="Apply"
							></Buttons>
						</Box>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}
export default Filter;
