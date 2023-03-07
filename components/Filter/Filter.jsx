import React from "react";

import {
	Box,
	Button,
	Center,
	Checkbox,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	HStack,
	Input,
	Stack,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { Buttons, Icon, IconButtons, Calenders } from "..";

function Filter() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	return (
		<>
			<Box display={{ base: "none", md: "initial" }}>
				<Button
					display={"flex"}
					justifyContent={"space-evenly"}
					alignItems={"center"}
					ref={btnRef}
					onClick={onOpen}
					h={{ base: "3rem", md: "2.5rem", "2xl": "3rem" }}
					w={{
						base: "8vw",
						sm: "12vw",
						md: "10vw",
						lg: "7vw",
						xl: "8vw",
						"2xl": "6vw",
					}}
					bg="#FFFFFF"
					color="#11299E"
					border="1px solid #11299E"
					boxShadow=" 0px 3px 10px #11299E1A"
					borderRadius="10px"
					_hover={{
						bg: "white",
					}}
					_active={{
						bg: "white",
					}}
				>
					<Center
						alignItems={"center"}
						width={{
							base: "10px",
							sm: "12px",

							lg: "14px",
							xl: "16px",
							"2xl": "20px",
						}}
						height={{
							base: "10px",
							sm: "12px",

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

							xl: "sm",
							"2xl": "lg",
						}}
						lineHeight={1}
					>
						Filter
					</Text>
				</Button>
			</Box>

			<Box display={{ base: "initial", md: "none" }}>
				<Button
					display={"flex"}
					gap={"10px"}
					ref={btnRef}
					onClick={onOpen}
					w={"100%"}
					h={"100%"}
					bg="primary.DEFAULT"
					color="#11299E"
					borderRadius={"0px"}
					boxShadow=" 0px 3px 10px #11299E1A"
				>
					<Icon name="filter" width="25px" color="white" />
					<Text
						as="span"
						color="white"
						fontSize={"18px"}
						lineHeight={"0"}
						fontWeight={"semibold"}
					>
						Filter
					</Text>
				</Button>
			</Box>

			<Drawer
				isOpen={isOpen}
				placement="right"
				onClose={onClose}
				finalFocusRef={btnRef}
				size={{
					base: "full",
					sm: "xs",
					md: "sm",

					"2xl": "lg",
				}}
			>
				<DrawerOverlay
					bg="#e9edf1b3"
					backdropFilter="blur(6px)"
					width={"100%"}
					h={"100%"}
				/>
				<DrawerContent
					borderTopRadius={{ base: "20px", sm: "0px" }}
					mt={{ base: "8", sm: "0px" }}
					// p={"10px"}
				>
					<DrawerHeader>
						<Box
							display={"flex"}
							justifyContent={"space-between"}
							w={"100%"}
							py={{
								base: "5px",
								sm: "0px",
								"2xl": ".5vw",
							}}
							px={{
								base: "3px",
								sm: "0px",

								"2xl": "1.5vw",
							}}
						>
							<Box
								display={"flex"}
								alignItems={"center"}
								gap={"10px"}
								fontWeight={"semibold"}
							>
								<Center
									w={{
										base: "15px",
										sm: "15px",
										md: "20px",

										"2xl": "25px",
									}}
								>
									<Icon name="filter" width="100%" />
								</Center>
								<Text
									fontSize={{
										base: "md",

										md: "sm",
										lg: "md",

										"2xl": "2xl",
									}}
									fontWeight={"semibold"}
								>
									Filter
								</Text>
							</Box>
							<Box
								display={"flex"}
								gap={"3px"}
								alignItems={"center"}
								onClick={onClose}
								fontSize="18px"
								cursor={"pointer"}
								color={"light"}
								lineHeight="0px"
							>
								<Center
									w={{
										base: "15px",
										sm: "15px",
										md: "20px",

										xl: "16px",
										"2xl": "25px",
									}}
								>
									<Icon name="close-outline" width="100%" />
								</Center>
								<Text
									fontSize={{
										base: "sm",
										sm: "xs",
										md: "sm",

										"2xl": "xl",
									}}
								>
									Close
								</Text>
							</Box>
						</Box>
					</DrawerHeader>

					<DrawerBody>
						<Stack
							gap={{
								base: "25vw",
								sm: "5vw",
								md: "15vw",
								lg: "13vw",
							}}
							py={{
								base: "1",
								sm: "8",
								md: "0px",
								lg: "1px",
								xl: "3",
								"2xl": "1.3vw",
							}}
							px={{
								base: "2",
								sm: "0",
								md: "0px",

								"2xl": "1.5vw",
							}}
						>
							<VStack
								w={"100%"}
								gap={{
									base: "6",
									md: "70px",
									lg: "52px",
									xl: "50px",
									"2xl": "60px",
								}}
							>
								<VStack
									align={"flex-start"}
									w={"full"}
									gap={{
										base: "px",

										md: "0.5",

										"2xl": "2.5",
									}}
								>
									<Text
										as={"span"}
										fontSize={{
											base: "sm",

											xl: "md",
											"2xl": "lg",
										}}
										fontWeight={"semibold"}
									>
										Filter by profile type
									</Text>
									<HStack
										w={"100%"}
										gap={{ base: "3px", md: "10px" }}
									>
										<Box w={"fit-content"} h={"100%"}>
											<Checkbox
												variant="rounded"
												spacing={"2"}
												size={{
													base: "sm",
													sm: "sm",

													"2xl": "lg",
												}}
											>
												iMerchant
											</Checkbox>
										</Box>
										<Box
											w={"fit-content"}
											h={"100%"}
											px={{
												base: "0px",
												md: "5px",
												xl: "20px",
												"2xl": "1.5vw",
											}}
										>
											<Checkbox
												spacing={"2"}
												variant="rounded"
												size={{
													base: "sm",
													sm: "sm",

													"2xl": "lg",
												}}
											>
												Seller
											</Checkbox>
										</Box>
										<Box w={"fit-content"} h={"100%"}>
											<Checkbox
												spacing={"2"}
												variant="rounded"
												size={{
													base: "sm",
													sm: "sm",
													md: "sm",
													lg: "sm",
													xl: "sm",
													"2xl": "lg",
												}}
											>
												Distributer
											</Checkbox>
										</Box>
									</HStack>
								</VStack>
								<VStack
									align={"flex-start"}
									w={"full"}
									gap={{
										base: "px",
										sm: "px",
										md: "0.5",
										lg: "0.5",
										xl: "0.5",
										"2xl": "2.5",
									}}
								>
									<Text
										as={"span"}
										fontSize={{
											base: "sm",
											sm: "sm",
											md: "sm",
											lg: "sm",
											xl: "md",
											"2xl": "lg",
										}}
										fontWeight={"semibold"}
									>
										Filter by account status
									</Text>
									<HStack w={"100%"}>
										<Box w={"50%"}>
											<Checkbox
												variant="rounded"
												spacing={"2"}
												size={{
													base: "sm",
													sm: "sm",
													md: "sm",
													lg: "sm",
													xl: "sm",
													"2xl": "lg",
												}}
											>
												Active
											</Checkbox>
										</Box>
										<Box w={"50%"} h={"100%"}>
											<Checkbox
												spacing={"2"}
												variant="rounded"
												size={{
													base: "sm",
													sm: "sm",
													md: "sm",
													lg: "sm",
													xl: "sm",
													"2xl": "lg",
												}}
											>
												Inactive
											</Checkbox>
										</Box>
									</HStack>
								</VStack>
								{/* <VStack
									align={"flex-start"}
									w={"full"}
									gap={{
										base: "px",
										sm: "px",
										md: "0.5",
										lg: "0.5",
										xl: "0.5",
										"2xl": "2.5",
									}}
								>
									<Text
										as={"span"}
										fontSize={{
											base: "sm",
											sm: "sm",
											md: "sm",
											lg: "sm",
											xl: "md",
											"2xl": "lg",
										}}
										fontWeight={"semibold"}
									>
										Filter by activation date range
									</Text>
									<Flex
										w={"100%"}
										justifyContent={"space-between"}
										direction={{
											base: "column",
											// md: "row",
										}}
										gap={{
											base: "3",
											sm: "2",
											md: "1",
											lg: "1.5",
											xl: "2",
											"2xl": "2.5",
										}}
									>
										<Flex
											align={"center"}
											gap={"5px"}
											h={{
												base: "11vw",
												sm: "30px",
												md: "30px",
												lg: "30px",
												xl: "35px",
												"2xl": "45px",
											}}
											w={{ base: "100%", md: "80%" }}
											border={"1px solid #D2D2D2"}
											borderRadius={"8px"}
											overflow={"hidden"}
										>
											<HStack
												h={"100%"}
												bg={"bg"}
												w={"25%"}
												pl={"15px"}
											>
												<Text>From:</Text>
											</HStack>
											<Box w={"70%"}>
												<Input
													size="sm"
													type="date"
													border={"none"}
													focusBorderColor={
														"transparent"
													}
												/>
											</Box>
										</Flex>
										<Flex
											align={"center"}
											gap={"5px"}
											h={{
												base: "11vw",
												sm: "30px",
												md: "30px",
												lg: "30px",
												xl: "35px",
												"2xl": "45px",
											}}
											w={{ base: "100%", md: "80%" }}
											border={"1px solid #D2D2D2"}
											borderRadius={"8px"}
											overflow={"hidden"}
										>
											<HStack
												h={"100%"}
												bg={"bg"}
												w={"25%"}
												pl={"15px"}
											>
												<Text>To:</Text>
											</HStack>
											<Box w={"70%"}>
												<Input
													size="sm"
													type="date"
													border={"none"}
													focusBorderColor={
														"transparent"
													}
												/>
											</Box>
										</Flex>
									</Flex>
								</VStack> */}

								{/* Calender */}

								<Flex direction={"column"} w="100%">
									<Text
										fontSize={{
											base: "",
											md: "16px",
											"2xl": "18px",
										}}
										fontWeight="semibold"
										mb="20px"
									>
										Filter by activation date range
									</Text>
									<Flex
										alignItems={"center"}
										direction={{
											base: "column",
											md: "row",
										}}
										gap={{ base: "20px", md: "0px" }}
									>
										<Flex w="100%">
											<Calenders
												// label="Filter by activation date range"
												w="100%"
												sublabel="From"
												labelStyle={{
													fontSize: "lg",
													fontWeight: "semibold",
													mb: "1.2rem",
												}}
												inputContStyle={{
													w: "100%",
													h: "48px",
													borderRadius: {
														base: "10px",
														md: "10px 0px 0px 10px",
													},
													borderRight: {
														base: "flex",
														md: "none",
													},
												}}
											/>
										</Flex>
										<Flex w="100%">
											<Calenders
												w="100%"
												sublabel="To"
												labelStyle={{
													fontSize: "lg",
													fontWeight: "semibold",
													mb: "1.2rem",
												}}
												inputContStyle={{
													w: "100%",
													h: "48px",
													borderRadius: {
														base: "10px",
														md: "0px 10px 10px 0px",
													},
												}}
											/>
										</Flex>
									</Flex>
								</Flex>
							</VStack>

							<Flex
								justifyContent={"flex-end"}
								alignItems="center"
								gap={{
									base: "7",
									sm: "6",
									md: "10",
									lg: "8",
									xl: "12",
									"2xl": "14",
								}}
							>
								<Button
									color={"accent.DEFAULT"}
									fontSize={"20px"}
									fontWeight="bold"
									bg="white"
									_focus={{
										bg: "white",
									}}
									_hover="none"
								>
									Clear all
								</Button>

								<Buttons
									h="3.6rem"
									title="Apply"
									fontSize="20px"
									fontWeight="bold"
									w={{
										base: "50%",
										sm: "10rem",
										md: "7.375rem",
									}}
								/>
							</Flex>
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}
export default Filter;
