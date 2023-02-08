import {
	Avatar,
	Box,
	Divider,
	Flex,
	HStack,
	IconButton,
	Image,
	Menu,
	MenuButton,
	MenuList,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Buttons, Icon } from "..";

const NavBar = (props) => {
	const { setNavOpen } = props;
	return (
		<>
			<Box
				as="nav"
				w={"full"}
				h={{ base: "12.2vw", sm: "10vw", md: "4.5vw" }}
			></Box>
			<Box
				top={"0%"}
				w={"full"}
				position={"fixed"}
				zIndex={"99"}
				as="section"
				boxShadow={"0px 3px 10px #0000001A"}
			>
				<Box
					position={"sticky"}
					as="nav"
					w={"full"}
					h={{ base: "12.2vw", sm: "10vw", md: "4.5vw" }}
				>
					<HStack
						bg={"white"}
						h={"full"}
						justifyContent={"space-between"}
						px={{ base: "4", sm: "6", md: "4", xl: "6" }}
					>
						<Box display={"flex"} alignItems={"center"}>
							<IconButton
								display={{ md: "none" }}
								onClick={() => {
									setNavOpen(true);
								}}
								aria-label="open menu"
								icon={<Icon name="nav-menu" />}
								size={"xs"}
								mr={{ base: "1vw", sm: "2vw", md: "1vw" }}
								variant="none"
							/>

							<Image
								src="/icons/logoimage.png"
								alt="logo"
								maxW={{ base: "24vw", sm: "18vw", md: "9vw" }}
							/>
						</Box>

						<Avatar
							display={{ base: "flex", md: "none" }}
							w={{ base: "6vw", sm: "5.5vw", md: "2.4vw" }}
							h={{ base: "6vw", sm: "5.5vw", md: "2.4vw" }}
							name="demo-user"
							src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
						/>
						<Box display={{ base: "none", md: "flex" }}>
							<Menu>
								<MenuButton>
									<Flex
										align={"center"}
										cursor={"pointer"}
										zIndex={"10"}
									>
										<Avatar
											w={{ base: "6vw", sm: "2.4vw" }}
											h={{ base: "6vw", sm: "2.4vw" }}
											name="demo-user"
											src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
										/>
										<Flex
											ml={"0.5vw"}
											h={"2.3vw"}
											justify={"center"}
											direction={"column"}
										>
											<Box
												display={"flex"}
												alignItems={"center"}
											>
												<Text
													fontSize={".85vw"}
													fontWeight={"semibold"}
													mr={"1.7vw"}
												>
													Aakash Enterprises
												</Text>
												<Icon
													name="drop-down"
													width="0.75vw"
													height="0.70vw"
												/>
											</Box>
											<Text
												fontSize={"0.7vw"}
												color={"secondary.DEFAULT"}
												textAlign={"start"}
											>
												Logged in as admin
											</Text>
										</Flex>
									</Flex>
								</MenuButton>

								<MenuList
									w={{
										base: "20vw",
										lg: "19vw",
										"2xl": "18vw",
									}}
									border={"none"}
									bg={"transparent"}
									boxShadow={"none"}
									borderRadius={"0px"}
									p={"0px"}
									mr={{ base: "-0.9vw", lg: "-0.6vw" }}
								>
									<Box
										border={"1px solid #D2D2D2"}
										boxShadow={"0px 6px 10px #00000033"}
										borderRadius={{
											base: "0.3rem",
											lg: "0.4rem",
											"2xl": ".9rem",
										}}
									>
										<VStack
											px={{ sm: "1", lg: "4" }}
											py={{ sm: "1", lg: "3" }}
											w={"full"}
											minH={"6vw"}
											bg={"accent.DEFAULT"}
											position={"relative"}
											borderTopRadius={{
												base: "0.3rem",
												lg: "0.4rem",
												"2xl": ".9rem",
											}}
										>
											<Icon
												name="drop-down"
												width="0.85vw"
												height="0.85vw"
												color="#11299E"
												style={{
													transform: "rotate(180deg)",
													position: "absolute",
													top: "-8.5%",
													right: "2.7%",
												}}
											/>
											<Box w={"full"} px={"0.2vw"}>
												<Flex
													w={"full"}
													align={"flex-end"}
													justifyContent={
														"space-between"
													}
												>
													<Text
														fontSize={"0.85vw"}
														w={"fit-content"}
														color={"highlight"}
													>
														Aakash Enterprises
													</Text>
													<Text
														fontSize={"0.55vw"}
														w={"fit-content"}
														color={"white"}
													>
														(Eko Code: 501837634)
													</Text>
												</Flex>
												<Flex w={"full"} py={".3vw"}>
													<Text
														fontSize={"0.55vw"}
														w={"fit-content"}
														color={"white"}
													>
														angeltech.google.co.in
													</Text>
												</Flex>
												<Flex
													w={"full"}
													pb={".3vw"}
													justifyContent={
														"space-between"
													}
												>
													<Flex
														justifyContent={
															"space-between"
														}
														mt={".4vw"}
													>
														<Box
															display={"flex"}
															alignItems={
																"center"
															}
														>
															<Text
																fontSize={
																	"0.7vw"
																}
																color={"white"}
															>
																+91 9871 67943
															</Text>
															<Box
																p={"0.3vw"}
																bg={
																	"primary.dark"
																}
																borderRadius={
																	"50%"
																}
																ml={"0.6vw"}
															>
																<Icon
																	name="mode-edit"
																	width=".5vw"
																	color="white"
																/>
															</Box>
														</Box>
													</Flex>
													<Flex>
														<Buttons
															fontSize={"0.6vw"}
															w={"7vw"}
															h={"2.3vw"}
															fontWeight={
																"medium"
															}
															borderRadius={{
																base: "4px",
																lg: "6px",
																"2xl": "5px",
															}}
														>
															<Text mr={".2vw"}>
																View Profile
															</Text>
															<Icon
																name="chevron-right"
																height="22%"
															/>
														</Buttons>
													</Flex>
												</Flex>
											</Box>
										</VStack>
										<VStack
											w={"full"}
											minH={"13vw"}
											bg={"white"}
											py={"3"}
											borderBottomRadius={{
												base: "0.3rem",
												lg: "0.4rem",
												"2xl": ".9rem",
											}}
										>
											<HStack
												h={"1.65vw"}
												w={"90%"}
												justifyContent={"space-between"}
												cursor={"pointer"}
											>
												<Text fontSize={"0.8vw"}>
													Business Contact
												</Text>
												<Icon
													name="chevron-right"
													width="0.6vw"
													height="0.6vw"
												/>
											</HStack>
											<Divider w={"90%"} />
											<HStack
												h={"1.65vw"}
												w={"90%"}
												justifyContent={"space-between"}
												cursor={"pointer"}
											>
												<Text fontSize={"0.8vw"}>
													Need Help
												</Text>
												<Icon
													name="chevron-right"
													width="0.6vw"
													height="0.6vw"
												/>
											</HStack>
											<Divider w={"90%"} />
											<HStack
												h={"1.65vw"}
												w={"90%"}
												justifyContent={"space-between"}
												cursor={"pointer"}
											>
												<Text fontSize={"0.8vw"}>
													Help Center
												</Text>
												<Icon
													name="chevron-right"
													width="0.6vw"
													height="0.6vw"
												/>
											</HStack>
											<Divider w={"90%"} />
											<HStack
												h={"1.65vw"}
												w={"90%"}
												justifyContent={"space-between"}
												cursor={"pointer"}
											>
												<Text fontSize={"0.8vw"}>
													Settings
												</Text>
												<Icon
													name="chevron-right"
													width="0.6vw"
													height="0.6vw"
												/>
											</HStack>
											<Divider w={"90%"} />
											<HStack
												minH={"2vw"}
												w={"90%"}
												justifyContent={"flex-start"}
												cursor={"pointer"}
												py={"0.6vw"}
											>
												<Icon
													name="logout"
													color="#FF4081"
													width="0.9vw"
													height="0.9vw"
												/>
												<Text
													fontSize={"0.8vw"}
													color={"error"}
													fontWeight={"medium"}
												>
													Logout
												</Text>
											</HStack>
										</VStack>
									</Box>
								</MenuList>
							</Menu>
						</Box>
					</HStack>
				</Box>
			</Box>
		</>
	);
};

export default NavBar;
