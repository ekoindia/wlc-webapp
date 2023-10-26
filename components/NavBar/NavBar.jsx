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
	Tooltip,
	useBreakpointValue,
	useToken,
	VStack,
} from "@chakra-ui/react";
import { useKBarReady } from "components/CommandBar";
import { Endpoints } from "constants";
import { adminProfileMenu, profileMenu } from "constants/profileCardMenus";
import { useOrgDetailContext, useUser } from "contexts";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment, useState } from "react";
import { clearCacheAndReload, limitText } from "utils";
import { svgBgDotted } from "utils/svgPatterns";
import { AdminViewToggleCard, Button, IcoButton, Icon, OrgLogo } from "..";

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
	const { userData, isAdmin, isAdminAgentMode, isOnboarding, isLoggedIn } =
		useUser();
	const { userDetails } = userData;
	const { orgDetail } = useOrgDetailContext();
	// const router = useRouter();
	const isMobile = useBreakpointValue({ base: true, md: false });

	// Check if CommandBar is loaded...
	const { ready } = useKBarReady();

	// Get theme color values
	const [contrast_color] = useToken("colors", ["navbar.dark"]);

	const GlobalSearch = dynamic(() => import("../GlobalSearch/GlobalSearch"), {
		ssr: false,
		loading: () => (
			<Box
				ml={1}
				w={{
					base: "auto",
					md: "280px",
					lg: "400px",
					xl: "500px",
				}}
				h="36px"
				radius={6}
				bg="shade"
			/>
		),
	});

	// const handleSearchKeyDown = (e) => {
	// 	if (e?.key === "Enter" && e?.target?.value?.length > 1) {
	// 		router.push(`/history?search=${e.target.value}`);
	// 	}
	// };

	return (
		<>
			<HStack
				bg="navbar.bg"
				h="full"
				justifyContent={"space-between"}
				px={{ base: "4", xl: "6" }}
				backgroundImage={svgBgDotted({
					fill: contrast_color,
					opacity: 0.04,
				})}
			>
				{/* Left-side items of navbar */}
				<Box
					display={"flex"}
					alignItems={"center"}
					flexGrow={isMobile ? 1 : 0}
				>
					<Flex align="center" minW={{ base: "auto", md: "250px" }}>
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
							dark={
								orgDetail?.metadata?.theme?.navstyle === "light"
							}
							ml={{ base: 1, lg: 0 }}
						/>
					</Flex>

					{ready && isLoggedIn === true && isOnboarding !== true && (
						<Flex
							flexGrow={isMobile ? 1 : 0}
							justify={isMobile ? "flex-end" : "flex-start"}
							pr={isMobile ? 2 : 0}
						>
							<GlobalSearch />
						</Flex>
					)}
				</Box>

				{/* Right-side items of navbar */}
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
								<Box
									bg="navbar.bgAlt"
									padding="2px"
									borderRadius="50%"
								>
									<Avatar
										w={{
											base: "34px",
											xl: "38px",
											"2xl": "42px",
										}}
										h={{
											base: "34px",
											xl: "38px",
											"2xl": "42px",
										}}
										name={userDetails?.name[0]}
										lineHeight="3px"
										src={userDetails?.pic}
									/>
								</Box>
								{isAdmin ? (
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
												as="span"
												fontSize={{
													base: "12px",
													"2xl": "16px",
												}}
												fontWeight="semibold"
												mr="1.6vw"
												color="navbar.text"
											>
												{limitText(
													userDetails?.name || "",
													12
												)}
											</Text>

											<Icon
												name="arrow-drop-down"
												size="xs"
												mt="2px"
												color="navbar.text"
											/>
										</Box>
										<Text
											fontSize={{
												base: "10px",
												"2xl": "14px",
											}}
											color={"navbar.textLight"}
											textAlign={"start"}
										>
											{isAdminAgentMode
												? "Viewing as Agent"
												: "Logged in as Admin"}
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
	const { isAdmin, logout, isOnboarding, userData } = useUser();
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
				w="full"
				// minH={"6vw"}
				bg="primary.DEFAULT"
				position="relative"
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
					color="primary.DEFAULT"
					transform="rotate(180deg)"
					position="absolute"
					top="-12px"
					right="14px"
				>
					<Icon name="arrow-drop-down" size="16px" />
				</Box>

				<Box w={"full"} py="10px" userSelect="none">
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
						{userDetails?.name ? (
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
								title={userDetails?.name || ""}
							>
								{userDetails?.name?.toLowerCase()}
							</Text>
						) : null}

						{userDetails?.code && userDetails?.code > 1 ? (
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
						) : null}
					</Flex>

					{userDetails?.email ? (
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
					) : null}

					{userDetails?.mobile && userDetails?.mobile > 1 ? (
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
										<IcoButton
											size={"xs"}
											theme="accent"
											ml="2"
											// onClick={() =>
											// 	Router.push("/admin/my-network/profile/up-per-info")
											// }

											iconName="mode-edit"
											// iconStyle={{
											// 	size: "10px",
											// }}
										/>
									</Box>
								</Box>
							</Flex>

							{isAdmin !== true && isOnboarding !== true && (
								<Link href={Endpoints.USER_PROFILE}>
									<Button
										size="xs"
										icon="chevron-right"
										iconPosition="right"
										iconSpacing="2px"
										h="36px"
										fontWeight="semibold"
										borderRadius="6px"
										fontSize="12px"
									>
										View Profile
									</Button>
								</Link>
							)}
						</Flex>
					) : null}
				</Box>

				{isOnboarding !== true && isAdmin === true ? (
					<AdminViewToggleCard minimal />
				) : null}
			</VStack>

			<VStack
				w={"full"}
				h={{ base: "100%", sm: "initial" }}
				bg={"white"}
				// py={"3"}
				borderBottomRadius={{
					base: "0.3rem",
					lg: "0.4rem",
					"2xl": ".9rem",
				}}
				gap={{ base: "15px", sm: "initial" }}
			>
				{isOnboarding !== true
					? menulist.map((ele) => (
							<Fragment key={"mnu-" + ele.title + ele.link}>
								<HStack
									h="2em"
									w={"90%"}
									justifyContent={"space-between"}
									cursor={"pointer"}
									mt={{ base: "15px", sm: "initial" }}
									// py="5"
									minH="46px"
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
					  ))
					: null}
				<Flex
					direction="row"
					minH={"46px"}
					w={"90%"}
					justifyContent={"flex-start"}
					cursor={"pointer"}
					align="center"
				>
					<HStack flex={1} py="3" onClick={logout}>
						<Icon name="logout" color="error" size="18px" mr="2" />
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
					<Flex
						ml="2"
						px="3"
						py="2"
						borderLeft={"1px solid"}
						borderColor={"divider"}
						onClick={() => clearCacheAndReload(true)}
						_hover={{ bg: "gray.100" }}
					>
						<Tooltip
							label="Clear Cache"
							/* hasArrow={true} */ placement="left"
						>
							<Box>
								<Icon
									name="reload"
									label="Clear Cache"
									color="error"
									size="14px"
								/>
							</Box>
						</Tooltip>
					</Flex>
				</Flex>
			</VStack>
		</Box>
	);
};
