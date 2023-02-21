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
import { Buttons, Headings, Icon } from "..";

const NavBar = (props) => {
	const { setNavOpen, isNavVisible, isSmallerThan769, headingObj } = props;
	return (
		<>
			<Box
				as="nav"
				w={"full"}
				h={{
					base: "56px",
					sm: "56px",
					md: "50px",
					lg: "60px",
					xl: "50px",
					"2xl": "90px",
				}}
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
					h={{
						base: "56px",
						sm: "56px",
						md: "50px",
						lg: "60px",
						xl: "50px",
						"2xl": "90px",
					}}
				>
					{isSmallerThan769 ? (
						isNavVisible ? (
							<NavContent setNavOpen={setNavOpen} />
						) : (
							<Flex h="100%" alignItems="center">
								<Headings
									title={headingObj.title}
									hasIcon={headingObj.hasIcon}
								/>
							</Flex>
						)
					) : (
						<NavContent setNavOpen={setNavOpen} />
					)}
				</Box>
			</Box>
		</>
	);
};

export default NavBar;

const NavContent = ({ setNavOpen }) => {
	return (
		<>
			<HStack
				bg={"white"}
				h={"full"}
				justifyContent={"space-between"}
				px={{ base: "4", sm: "4", md: "4", xl: "6" }}
			>
				<Box display={"flex"} alignItems={"center"}>
					<IconButton
						display={{ lg: "none" }}
						onClick={() => {
							setNavOpen(true);
						}}
						aria-label="open menu"
						icon={<Icon name="nav-menu" />}
						size={"sm"}
						mr={{
							base: "1vw",
							sm: "2vw",
							md: "1vw",
						}}
						variant="none"
					/>

					<Image
						src="/icons/logoimage.png"
						alt="logo"
						maxH={{
							base: "35px",
							sm: "34px",
							md: "30px",
							lg: "34px",
							xl: "30px",
							"2xl": "46px",
						}}
					/>
				</Box>
				<Box display={{ base: "flex", md: "flex" }}>
					<Menu>
						<MenuButton>
							<Flex
								align={"center"}
								cursor={"pointer"}
								zIndex={"10"}
							>
								<Avatar
									w={{
										base: "35px",
										sm: "34px",
										md: "30px",
										lg: "34px",
										xl: "30px",
										"2xl": "46px",
									}}
									h={{
										base: "35px",
										sm: "34px",
										md: "30px",
										lg: "34px",
										xl: "30px",
										"2xl": "46px",
									}}
									name="demo-user"
									src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
								/>
								<Flex
									ml={"0.5vw"}
									h={"2.3vw"}
									justify={"center"}
									direction={"column"}
									display={{ base: "none", md: "flex" }}
									lineHeight={{
										md: "15px",
										lg: "16px",
										xl: "18px",
										"2xl": "22px",
									}}
								>
									<Box display={"flex"} alignItems={"center"}>
										<Text
											fontSize={{
												md: "12px",
												lg: "14px",
												xl: "12px",
												"2xl": "18px",
											}}
											fontWeight={"semibold"}
											mr={"1.7vw"}
										>
											Aakash Enterprises
										</Text>
										<Box
											width={{ md: "1vw", lg: "0.75vw" }}
											height={{ md: "1vw", lg: "0.70vw" }}
										>
											<Icon name="drop-down" />
										</Box>
									</Box>
									<Text
										fontSize={{
											md: "10px",
											lg: "10px",
											xl: "10px",
											"2xl": "14px",
										}}
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
								sm: "270px",
								md: "280px",
								lg: "300px",
								xl: "350px",
								"2xl": "400px",
							}}
							border={"none"}
							bg={"transparent"}
							boxShadow={"none"}
							borderRadius={"0px"}
							p={"0px"}
							mr={{
								base: "-0.9vw",
								lg: "-0.6vw",
							}}
							display={{ base: "none", sm: "block" }}
						>
							<MyAccountCard />
						</MenuList>
					</Menu>
				</Box>
			</HStack>
		</>
	);
};

const MyAccountCard = () => {
	return (
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
				px={{ sm: "2", md: "1", lg: "4" }}
				py={{ sm: "2", md: "1", lg: "3" }}
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
					width="16px"
					height="16px"
					color="#11299E"
					style={{
						transform: "rotate(180deg)",
						position: "absolute",
						top: "-8.5%",
						right: "2.7%",
					}}
				/>
				<Box
					w={"full"}
					px={{
						base: "0.4vw",
						lg: "0.2vw",
					}}
				>
					<Flex
						w={"full"}
						align={"flex-end"}
						// justifyContent={"space-betw"}
						gap={{ base: "25px", xl: "20px", "2xl": "25px" }}
					>
						<Text
							fontSize={{
								sm: "12px",
								md: "12px",
								lg: "14px",
								"2xl": "14px",
							}}
							w={"fit-content"}
							color={"highlight"}
						>
							Aakash Enterprises
						</Text>
						<Text
							fontSize={{
								sm: "10px",
								md: "8px",
								lg: "8px",
								xl: "10px",
								"2xl": "10px",
							}}
							w={"fit-content"}
							color={"white"}
						>
							(Eko Code:{" "}
							<Text as={"span"} fontWeight={"medium"}>
								{" "}
								501837634
							</Text>
							)
						</Text>
					</Flex>
					<Flex w={"full"} py={".3vw"}>
						<Text
							fontSize={{
								sm: "10px",
								md: "8px",
								lg: "8px",
								xl: "10px",
								"2xl": "10px",
							}}
							w={"fit-content"}
							color={"white"}
						>
							angeltech.google.co.in
						</Text>
					</Flex>
					<Flex
						w={"full"}
						pb={".3vw"}
						justifyContent={"space-between"}
					>
						<Flex justifyContent={"space-between"} mt={".4vw"}>
							<Box display={"flex"} alignItems={"center"}>
								<Text
									fontSize={{
										sm: "10px",
										md: "8px",
										lg: "10px",
										"2xl": "10px",
									}}
									color={"white"}
								>
									+91 9871 67943
								</Text>
								<Box
									p={"3.5px"}
									bg={"primary.dark"}
									borderRadius={"50%"}
									ml={"0.6vw"}
								>
									<Icon
										name="mode-edit"
										width="8px"
										color="white"
									/>
								</Box>
							</Box>
						</Flex>
						<Flex>
							<Buttons
								fontSize={"0.6vw"}
								w={{
									base: "108px",
									sm: "90px",
									md: "90px",
									lg: "100px",
									xl: "100px",
									"2xl": "108px",
								}}
								h={{
									base: "36px",
									sm: "30px",
									md: "30px",
									lg: "30px",
									xl: "34px",
									"2xl": "36px",
								}}
								fontWeight={"medium"}
								borderRadius={{
									base: "4px",
									lg: "6px",
									"2xl": "5px",
								}}
							>
								<Text
									mr={".2vw"}
									fontSize={{
										base: "8px",
										sm: "8px",
										md: "8px",
										lg: "10px",
										xl: "10px",
										"2xl": "12px",
									}}
								>
									View Profile &gt;
								</Text>
								{/* <Icon name="chevron-right" height="22%" /> */}
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
					<Text
						fontSize={{
							base: "10px",
							sm: "10px",
							md: "10px",
							lg: "12px",
							xl: "12px",
							"2xl": "14px",
						}}
					>
						Business Contact
					</Text>
					{/* <Box  width={{base: "8px", sm: "8px", md: "8px", lg: "8px", xl: "8px", "2xl": "8px"}} height={{base: "8px", sm: "8px", md: "8px", lg: "8px", xl: "8px", "2xl": "8px"}} > */}
					<Icon name="chevron-right" width="8px" height="8px" />
					{/* </Box> */}
				</HStack>
				<Divider w={"90%"} />
				<HStack
					h={"1.65vw"}
					w={"90%"}
					justifyContent={"space-between"}
					cursor={"pointer"}
				>
					<Text
						fontSize={{
							base: "10px",
							sm: "10px",
							md: "10px",
							lg: "12px",
							xl: "12px",
							"2xl": "14px",
						}}
					>
						Need Help
					</Text>
					<Icon name="chevron-right" width="8px" height="8px" />
				</HStack>
				<Divider w={"90%"} />
				<HStack
					h={"1.65vw"}
					w={"90%"}
					justifyContent={"space-between"}
					cursor={"pointer"}
				>
					<Text
						fontSize={{
							base: "10px",
							sm: "10px",
							md: "10px",
							lg: "12px",
							xl: "12px",
							"2xl": "14px",
						}}
					>
						Help Center
					</Text>
					<Icon name="chevron-right" width="8px" height="8px" />
				</HStack>
				<Divider w={"90%"} />
				<HStack
					h={"1.65vw"}
					w={"90%"}
					justifyContent={"space-between"}
					cursor={"pointer"}
				>
					<Text
						fontSize={{
							base: "10px",
							sm: "10px",
							md: "10px",
							lg: "12px",
							xl: "12px",
							"2xl": "14px",
						}}
					>
						Settings
					</Text>
					<Icon name="chevron-right" width="8px" height="8px" />
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
						width="18px"
						height="18px"
					/>
					<Text
						fontSize={{
							base: "10px",
							sm: "10px",
							md: "10px",
							lg: "12px",
							xl: "12px",
							"2xl": "14px",
						}}
						color={"error"}
						fontWeight={"medium"}
					>
						Logout
					</Text>
				</HStack>
			</VStack>
		</Box>
	);
};
