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
import { useState } from "react";
import { Buttons, Icon, IconButtons } from "..";
import { useUser } from "contexts/UserContext";
import { useRouter } from "next/router";

const NavBar = (props) => {
	const [isCardOpen, setIsCardOpen] = useState(false);
	const { setNavOpen, isNavVisible, isSmallerThan769, headingObj, propComp } =
		props;

	return (
		<>
			{isCardOpen && (
				<Box
					display={{ base: "flex", sm: "none" }}
					width="100%"
					h="100%"
					position={"fixed"}
					zIndex={"999"}
				>
					<MyAccountCard setIsCardOpen={setIsCardOpen} />
				</Box>
			)}

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
					<NavContent
						setNavOpen={setNavOpen}
						setIsCardOpen={setIsCardOpen}
					/>
				</Box>
			</Box>
		</>
	);
};

export default NavBar;

const NavContent = ({ setNavOpen, setIsCardOpen }) => {
	const { userData } = useUser();
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
						icon={<Icon name="menu" />}
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
						<MenuButton
							onClick={() => {
								setIsCardOpen(true);
							}}
						>
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
								{userData?.role === "admin" ? (
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
										<Box
											display={"flex"}
											alignItems={"center"}
										>
											<Text
												fontSize={{
													md: "12px",
													lg: "14px",
													xl: "12px",
													"2xl": "18px",
												}}
												fontWeight={"semibold"}
												mr={"1.6vw"}
											>
												Aakash Enterprises
											</Text>

											<Icon
												name="arrow-drop-down"
												width={{
													md: "1vw",
													lg: "0.75vw",
												}}
												height={{
													md: "1vw",
													lg: "0.70vw",
												}}
												pt="2px"
											/>
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
								) : null}
							</Flex>
						</MenuButton>

						<MenuList
							w={{
								sm: "270px",
								md: "280px",
								lg: "290px",
								xl: "320px",
								"2xl": "349px",
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

const MyAccountCard = ({ setIsCardOpen }) => {
	const { logout, userData } = useUser();
	const router = useRouter();
	const logoutHandler = () => {
		// router.push("/");
		logout();
	};

	return (
		<Box
			border="card"
			boxShadow={"0px 6px 10px #00000033"}
			borderRadius={{
				base: "0.3rem",
				lg: "0.4rem",
				"2xl": ".9rem",
			}}
			w={{ base: "100%", sm: "initial" }}
		>
			<VStack
				px={{ base: "3", sm: "2", md: "2", lg: "4" }}
				py={{ base: "2", sm: "2", md: "1", lg: "" }}
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
				<Flex
					color="white"
					justifyContent={"flex-end"}
					w="100%"
					display={{ base: "flex", sm: "none" }}
				>
					<Icon
						name="close"
						width="	16px"
						onClick={() => {
							setIsCardOpen(false);
						}}
					/>
				</Flex>
				<Box
					display={{ base: "none", sm: "initial" }}
					color="accent.DEFAULT"
					transform="rotate(180deg)"
					position="absolute"
					top="-19%"
					right="2%"
				>
					<Icon name="arrow-drop-down" width="16px" height="16px" />
				</Box>

				<Box
					w={"full"}
					px={{
						base: "vw",
						md: "0.2vw",
					}}
					py={{ base: "10px", sm: "0px" }}
				>
					<Flex
						w={"full"}
						align={"flex-end"}
						wrap="wrap"
						justifyContent={{
							base: "space-between",
							sm: "initial",
						}}
						gap={{
							sm: "25px",
							xl: "20px",
							"2xl": "25px",
						}}
						lineHeight="normal"
					>
						<Text
							fontSize={{
								base: "16px",
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
								base: "12px",
								sm: "10px",
								md: "8px",
								lg: "8px",
								xl: "10px",
								"2xl": "10px",
							}}
							w={"fit-content"}
							color={"white"}
							mb="3px"
						>
							(Eko Code:{" "}
							<Text as={"span"} fontWeight={"medium"}>
								501837634
							</Text>
							)
						</Text>
					</Flex>
					<Flex w={"full"} py={".3vw"}>
						<Text
							fontSize={{
								base: "12px",
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
						mt={{ base: "8px", sm: "initial" }}
						wrap="wrap"
					>
						<Flex justifyContent={"space-between"} mt={".4vw"}>
							<Box display={"flex"} alignItems={"center"}>
								<Text
									fontSize={{
										base: "12px",
										sm: "10px",
										md: "8px",
										lg: "10px",
										"2xl": "10px",
									}}
									color={"white"}
								>
									+91 9871 67943
								</Text>
								<Box ml={{ base: "15px", sm: "initial" }}>
									<IconButtons
										iconSize={"xs"}
										// onClick={() =>
										// 	Router.push("/admin/my-network/profile/up-per-info")
										// }

										iconName="mode-edit"
										iconStyle={{
											width: "10px",
											height: "10px",
										}}
									/>
								</Box>
							</Box>
						</Flex>

						<Flex>
							<Buttons
								fontSize={"0.6vw"}
								w={{
									base: "140px",
									sm: "90px",
									md: "90px",
									lg: "100px",
									xl: "100px",
									"2xl": "108px",
								}}
								h={{
									base: "48px",
									sm: "30px",
									md: "30px",
									lg: "30px",
									xl: "34px",
									"2xl": "36px",
								}}
								fontWeight={"medium"}
								borderRadius={{
									base: "10px",
									lg: "6px",
									"2xl": "5px",
								}}
							>
								<Text
									mr={".2vw"}
									fontSize={{
										base: "14px",
										sm: "8px",
										md: "8px",
										lg: "10px",
										xl: "10px",
										"2xl": "12px",
									}}
								>
									View Profile &gt;
								</Text>
							</Buttons>
						</Flex>
					</Flex>
				</Box>
			</VStack>

			<VStack
				w={"full"}
				minH={"13vw"}
				h={{ base: "100%", sm: "initial" }}
				bg={"white"}
				py={"3"}
				borderBottomRadius={{
					base: "0.3rem",
					lg: "0.4rem",
					"2xl": ".9rem",
				}}
				gap={{ base: "15px", sm: "initial" }}
			>
				<HStack
					h={{ base: "1.65", sm: "1.65vw" }}
					w={"90%"}
					justifyContent={"space-between"}
					cursor={"pointer"}
					mt={{ base: "15px", sm: "initial" }}
				>
					<Text
						fontSize={{
							base: "14px",
							sm: "10px",
							md: "10px",
							lg: "12px",
							xl: "12px",
							"2xl": "14px",
						}}
					>
						Business Contact
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
							base: "14px",
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
							base: "14px",
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
							base: "14px",
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
					onClick={logoutHandler}
				>
					<Icon
						name="logout"
						color="#FF4081"
						width="18px"
						height="18px"
					/>
					<Text
						fontSize={{
							base: "14px",
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
