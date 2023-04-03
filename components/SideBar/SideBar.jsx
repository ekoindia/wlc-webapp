import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Avatar,
	Box,
	Circle,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { adminMenu, nonAdminMenu, roles } from "constants";
import { useMenuContext } from "contexts/MenuContext";
import { useUser } from "contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Icon } from "..";

function isCurrentRoute(router, currPath) {
	const path = router.asPath.split("?")[0];
	if (path === currPath) return true;

	const splittedPath = path.split("/");
	const splittedCurrPath = currPath.split("/");
	let isSamePath = false;

	for (let i = 1; i < splittedCurrPath.length; i++) {
		if (
			splittedPath[i] === splittedCurrPath[i] &&
			splittedCurrPath[i] !== "admin"
		) {
			isSamePath = true;
		} else {
			isSamePath = false;
		}
	}
	return isSamePath ? true : false;
}

//MAIN EXPORT
const SideBar = (props) => {
	return (
		<>
			<Box display={{ base: "flex", lg: "none" }}>
				<MenuBar props={props} />
			</Box>
			<Box display={{ base: "none", lg: "flex" }}>
				<SideBarMenu />
			</Box>
		</>
	);
};

export default SideBar;

//FOR LAPTOP SCREENS
const SideBarMenu = ({ className = "", ...props }) => {
	const { userData } = useUser();
	const { interaction_list } = useMenuContext();
	// console.log("interaction_list", interaction_list);
	const router = useRouter();
	const [currentRoute, setcurrentRoute] = useState();
	// console.log("currentRoute", currentRoute);

	useEffect(() => {
		setcurrentRoute(router.pathname.split("/")[2]);
	}, [router.asPath]);

	const menuList = userData?.is_org_admin ? adminMenu : nonAdminMenu;

	return (
		<Box
			minW={{
				base: "full",
				sm: "55vw",
				md: "13.5vw",
				lg: "200px",
				xl: "225px",
				"2xl": "250px",
			}}
			bgColor={"accent.DEFAULT"}
			height={"100%"}
		>
			<Flex direction="column">
				<Box borderRight="12px" height={"100%"} w={"full"}>
					{userData?.is_org_admin === 0 && (
						<>
							<ProfileCard
								name={userData?.userDetails?.name}
								mobileNumber={userData?.userDetails?.mobile}
								img={userData?.userDetails?.pic}
							/>

							<BalanceCard />
						</>
					)}

					{menuList?.map((menu, index) => {
						switch (true) {
							case menu.comp:
								return (
									<>
										<WalletBalance />
									</>
								);
							case menu.subLevel && menu.api:
								return (
									<>
										<CollapseMenu
											menu={menu}
											interaction_list={interaction_list}
											currentRoute={currentRoute}
											role={userData?.role}
										/>
									</>
								);
							case menu.subLevel && menu.subLevelObject != null:
								return (
									<>
										<CollapseMenu
											menu={menu}
											interaction_list={
												menu.subLevelObject
											}
											currentRoute={currentRoute}
											role={userData?.role}
										/>
									</>
								);
							default:
								return (
									<>
										<LinkMenu
											menu={menu}
											currentRoute={currentRoute}
											index={index}
											role={userData?.role}
										/>
									</>
								);
						}
					})}
				</Box>
				{/* {rest.children} */}
			</Flex>
		</Box>
	);
};

//FOR MOBILE SCREENS
const MenuBar = ({ props }) => {
	const { navOpen, setNavOpen } = props;
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Drawer
			autoFocus={false}
			isOpen={navOpen}
			placement="left"
			onClose={onClose}
			returnFocusOnClose={false}
			onOverlayClick={() => {
				setNavOpen(false);
			}}
			size="full"
		>
			<DrawerOverlay />
			<DrawerContent maxW="250px" boxShadow={"none"}>
				<SideBarMenu />
			</DrawerContent>
		</Drawer>
	);
};

const CollapseMenu = (props) => {
	const { menu, interaction_list, currentRoute, role } = props;
	const router = useRouter();
	return (
		<Flex textColor="white" justify="space-between">
			<Accordion allowMultiple w="100%">
				<AccordionItem borderBottom="br-sidebar" borderTop="none">
					{({ isExpanded }) => (
						<>
							<AccordionButton
								pl={{
									base: "5",
									md: "5",
									lg: "4",
									"2xl": "6",
								}}
								py={{
									base: "4",
									md: "3",
									xl: "3.5",
									"2xl": "5",
								}}
							>
								<Flex
									align="center"
									justify="space-between"
									w="100%"
									cursor="pointer"
									padding="0px"
								>
									<Flex align="center" gap="13px" w={"full"}>
										<Icon
											name={menu.icon}
											w={{
												base: "20px",
												sm: "20px",
												md: "18px",
												lg: "18px",
												xl: "18px",
												"2xl": "27px",
											}}
										/>
										<Text
											fontSize={{
												base: "14px",
												sm: "14px",
												md: "12px",
												lg: "12px",
												xl: "12px",
												"2xl": "16px",
											}}
										>
											{menu.name}
										</Text>
									</Flex>
									<Circle bg="sidebar.icon-bg" size="5">
										{!isExpanded ? (
											<Icon
												name="expand-add"
												width="10px"
											/>
										) : (
											<Icon name="remove" width="12px" />
										)}
									</Circle>
								</Flex>
							</AccordionButton>

							<AccordionPanel padding={"0px"} border="none">
								{interaction_list?.map((item, index) => {
									const link =
										item.link || `/transaction/${item?.id}`;
									const isCurrent = isCurrentRoute(
										router,
										link,
										role
									);
									return (
										<Link key={index} href={link}>
											<Box
												w="100%"
												padding="0px 14px 0px 40px"
												bg={
													isCurrent
														? "sidebar.active-bg"
														: ""
												}
												borderLeft="8px"
												borderLeftColor={
													isCurrent
														? "sidebar.active-border"
														: "transparent"
												}
												outline={
													isCurrent
														? "var(--chakra-borders-br-sidebar)"
														: ""
												}
											>
												<Flex
													align="center"
													justify="space-between"
													padding="12px 0px 12px 0px"
													borderTop="br-sidebar"
													borderTopStyle="dashed"
												>
													<Flex
														align="center"
														columnGap="10px"
													>
														<Icon
															name={item.icon}
															w={{
																base: "20px",
																sm: "20px",
																md: "18px",
																lg: "18px",
																xl: "18px",
																"2xl": "27px",
															}}
														/>
														<Text
															fontSize={{
																base: "12px",
																sm: "12px",
																md: "11px",
																lg: "11px",
																xl: "11px",
																"2xl": "14px",
															}}
															textColor={"white"}
														>
															{item.label}
														</Text>
													</Flex>
													<Icon
														color={
															isCurrent
																? "#FE7D00"
																: "#556FEF"
														}
														name="chevron-right"
														width="12px"
													/>
												</Flex>
											</Box>
										</Link>
									);
								})}
							</AccordionPanel>
						</>
					)}
				</AccordionItem>
			</Accordion>
		</Flex>
	);
};

const LinkMenu = (props) => {
	const { menu, currentRoute, index, role } = props;
	const router = useRouter();
	const isCurrent = isCurrentRoute(router, menu.link, role);
	return (
		<Link href={menu.link} key={index}>
			<Flex
				key={index}
				fontSize={{
					base: "14px",
					sm: "14px",
					md: "12px",
					lg: "12px",
					xl: "12px",
					"2xl": "16px",
				}}
				color="white"
				align="center"
				gap="13px"
				px={{
					base: "3",
					md: "3",
					lg: "2",
					"2xl": "4",
				}}
				py={{
					base: "4",
					md: "3",
					xl: "3.5",
					"2xl": "5",
				}}
				w={"full"}
				role="group"
				cursor="pointer"
				borderBottom="br-sidebar"
				bg={isCurrent ? "sidebar.active-bg" : ""}
				borderLeft="8px"
				borderLeftColor={
					isCurrent ? "sidebar.active-border" : "transparent"
				}
			>
				<Icon
					name={menu.icon}
					w={{
						base: "20px",
						sm: "20px",
						md: "18px",
						lg: "18px",
						xl: "18px",
						"2xl": "27px",
					}}
				/>
				{menu.name}
			</Flex>
		</Link>
	);
};

const BalanceCard = ({ balance = "100" }) => {
	return (
		<Flex
			padding={{
				base: "15px 10px 10px 15px",
			}}
			width="100%"
			align="center"
			justify="space-between"
			bg="sidebar.card-bg-dark"
			borderBottom="br-sidebar"
		>
			<Flex gap={{ base: "2.5" }}>
				<Flex>
					<Icon
						name="wallet-outline"
						color="#556fef"
						w={{
							base: "22px",
							sm: "22px",
							md: "22px",
							lg: "22px",
							xl: "22px",
							"2xl": "27px",
						}}
					/>
				</Flex>
				<Flex direction="column">
					<Text
						color="white"
						fontSize={{
							base: "12px",
							sm: "12px",
							md: "12px",
							lg: "12px",
							xl: "12px",
							"2xl": "16px",
						}}
						lineHeight="1"
					>
						Wallet Balance
					</Text>
					<Flex color="#FFD93B" align="center" gap="1">
						<Icon
							name="rupee"
							w={{
								base: "12px",
								sm: "12px",
								md: "13px",
								lg: "12px",
								xl: "12px",
								"2xl": "14px",
							}}
							h={{
								base: "12px",
								sm: "12px",
								md: "13px",
								lg: "12px",
								xl: "12px",
								"2xl": "14px",
							}}
						/>
						<Text
							fontSize={{
								base: "16px",
								sm: "16px",
								md: "14px",
								lg: "14px",
								xl: "14px",
								"2xl": "18px",
							}}
						>
							{balance}
						</Text>
					</Flex>
				</Flex>
			</Flex>
			<Flex>
				<Circle
					size={{ base: "8", md: "6", lg: "8" }}
					bg={"success"}
					color="white"
					boxShadow="0px 3px 6px #00000029"
					border="2px solid #FFFFFF"
				>
					<Icon
						name="add"
						width={{ base: "16px", md: "14px", lg: "16px" }}
					/>
				</Circle>
			</Flex>
		</Flex>
	);
};

const ProfileCard = ({ name, mobileNumber, img }) => {
	function formatNumber(number) {
		if (!number) return null;
		let len = number.length;
		return number.slice(0, len / 2) + " " + number.slice(len / 2);
	}
	return (
		<Flex
			h="90px"
			w="100%"
			padding={{
				base: "15px 10px 19px 15px",
			}}
			align="center"
			bg="sidebar.card-bg"
			borderBottom="br-sidebar"
			gap={{ base: "14px", lg: "10px", "2xl": "14px" }}
		>
			<Circle bg="sidebar.icon-bg" size={{ base: 14, lg: 12, xl: 14 }}>
				<Avatar
					w={{ base: "50px", lg: "48px", xl: "50px" }}
					h="50px"
					src={img}
					name={name[0]}
				/>
			</Circle>

			<Flex
				direction="column"
				justify="space-between"
				justifyContent="space-between"
				h="100%"
				lineHeight="18px"
			>
				<Text as="span" fontSize="12px" color="sidebar.font">
					Welcome
					<Text color="highlight" fontSize="14px">
						{name || "Abhishek Jaiswal"}
					</Text>
				</Text>
				<Flex
					align="center"
					fontSize="12px"
					columnGap="5px"
					color="white"
				>
					<Icon name="phone-circle-outline" w="18px" h="18px"></Icon>
					{formatNumber(mobileNumber) || "95989 13094"}
				</Flex>
			</Flex>
		</Flex>
	);
};
