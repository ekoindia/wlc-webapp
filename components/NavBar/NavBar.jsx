import {
	Avatar,
	Box,
	Divider,
	Flex,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	Text,
	VStack,
} from "@chakra-ui/react";
import { adminProfileMenu, profileMenu } from "constants/profileCardMenus";
import { useOrgDetailContext, useUser } from "contexts";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Button, Icon, IconButtons, OrgLogo } from "..";

export const NavHeight = {
	base: "56px",
	md: "50px",
	lg: "60px",
	"2xl": "90px",
};

const NavBar = ({ setNavOpen }) => {
	const [isCardOpen, setIsCardOpen] = useState(false);

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

			<Box as="nav" w={"full"} h={NavHeight}></Box>
			<Box
				top={"0%"}
				w={"full"}
				position={"fixed"}
				zIndex={"99"}
				as="section"
				boxShadow={"0px 3px 10px #0000001A"}
			>
				<Box position={"sticky"} as="nav" w={"full"} h={NavHeight}>
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
	const { userDetails } = userData;
	const { orgDetail } = useOrgDetailContext();

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

					<OrgLogo
						orgDetail={orgDetail}
						size="md"
						ml={{ base: 1, lg: 0 }}
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
									name={userDetails?.name[0]}
									lineHeight="3px"
									src={userData?.userDetails?.pic}
								/>
								{userData?.is_org_admin === 1 ? (
									<Flex
										ml={"0.5vw"}
										h={"2.3vw"}
										justify={"center"}
										direction={"column"}
										display={{ base: "none", md: "flex" }}
										lineHeight={{
											base: "15px",
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
													base: "12px",
													lg: "14px",
													xl: "12px",
													"2xl": "18px",
												}}
												fontWeight={"semibold"}
												mr={"1.6vw"}
											>
												{userDetails?.name}
											</Text>

											<Icon
												name="arrow-drop-down"
												size="xs"
												mt="2px"
											/>
										</Box>
										<Text
											fontSize={{
												base: "10px",
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
								base: "270px",
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
	const { isAdmin, logout, userData } = useUser();
	const { userDetails } = userData;
	const menulist = isAdmin ? adminProfileMenu : profileMenu;

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
						size="16px"
						onClick={() => setIsCardOpen(false)}
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
					<Icon name="arrow-drop-down" size="16px" />
				</Box>

				<Box
					w={"full"}
					px={{
						base: "vw",
						md: "0.2vw",
					}}
					py={{ base: "10px", sm: "0px" }}
					userSelect="none"
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
							base: "20px",
							"2xl": "25px",
						}}
						lineHeight="normal"
					>
						<Text
							fontSize={{
								base: "16px",
								sm: "12px",
								lg: "14px",
							}}
							color={"highlight"}
							textTransform="capitalize"
							whiteSpace="nowrap"
							overflow="hidden"
							textOverflow="ellipsis"
							width="40%"
							title={userDetails?.name}
						>
							{userDetails?.name?.toLowerCase()}
						</Text>
						<Text
							fontSize={{
								base: "12px",
								sm: "10px",
							}}
							w={"fit-content"}
							color={"white"}
							mb="3px"
						>
							(User Code:{" "}
							<Text as={"span"} fontWeight={"medium"}>
								{userDetails?.code}
							</Text>
							)
						</Text>
					</Flex>
					<Flex w={"full"} py={".3vw"}>
						<Text
							fontSize={{
								base: "12px",
								sm: "10px",
							}}
							w={"fit-content"}
							color={"white"}
						>
							{userDetails?.email}
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
									}}
									color={"white"}
								>
									+91{" "}
									{userDetails?.mobile.slice(0, 5) +
										" " +
										userDetails?.mobile.slice(5)}
								</Text>
								<Box ml={{ base: "15px", sm: "initial" }}>
									<IconButtons
										iconSize={"xs"}
										// onClick={() =>
										// 	Router.push("/admin/my-network/profile/up-per-info")
										// }

										iconName="mode-edit"
										iconStyle={{
											size: "10px",
										}}
									/>
								</Box>
							</Box>
						</Flex>

						<Flex>
							<Button
								fontSize={"0.6vw"}
								w={{
									base: "140px",
									sm: "90px",
									lg: "100px",
									"2xl": "108px",
								}}
								h={{
									base: "48px",
									sm: "30px",
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
										lg: "10px",
										"2xl": "12px",
									}}
								>
									View Profile &gt;
								</Text>
							</Button>
						</Flex>
					</Flex>
				</Box>
			</VStack>

			<VStack
				w={"full"}
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
				{menulist.map((ele) => (
					<Fragment key={"mnu-" + ele.title + ele.link}>
						<HStack
							h={{ base: "1.65", sm: "1.65vw" }}
							w={"90%"}
							justifyContent={"space-between"}
							cursor={"pointer"}
							mt={{ base: "15px", sm: "initial" }}
						>
							<Link href={ele.link}>
								<Text
									fontSize={{
										base: "14px",
										sm: "10px",
										lg: "12px",
										"2xl": "14px",
									}}
								>
									{ele.title}
								</Text>
							</Link>
							<Icon name="chevron-right" size="8px" />
						</HStack>
						<Divider w={"90%"} />
					</Fragment>
				))}
				<HStack
					minH={"2vw"}
					w={"90%"}
					justifyContent={"flex-start"}
					cursor={"pointer"}
					py={"0.6vw"}
					onClick={logout}
				>
					<Icon name="logout" color="error" size="18px" />
					<Text
						fontSize={{
							base: "14px",
							sm: "10px",
							lg: "12px",
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
