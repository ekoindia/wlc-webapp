import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Box,
	Circle,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { adminSidebarMenu, sidebarMenu } from "constants";
import { useMenuContext } from "contexts/MenuContext";
import { useUser } from "contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Icon, ProfileCard, StatusCard } from "..";

/**
 * A helper function to check if the current route is the same as the route passed to it.
 * @param {Object} router The router object from next/router.
 * @param {string} currPath The path to compare with the current route.
 * @returns {boolean} True if the current route is the same as the route passed to it.
 **/
function isCurrentRoute(router, currPath) {
	// TODO: Fix: Inefficient code. Refactor this.
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
				<MenuBar {...props} />
			</Box>
			<Box display={{ base: "none", lg: "flex" }}>
				<SideBarMenu />
			</Box>
		</>
	);
};

export default SideBar;

//FOR LAPTOP SCREENS
const SideBarMenu = () => {
	const { userData } = useUser();
	const { interactions } = useMenuContext();
	const { interaction_list } = interactions;
	// const router = useRouter();

	const menuList =
		userData?.is_org_admin === 1 ? adminSidebarMenu : sidebarMenu;

	return (
		<Box
			className="sidebar"
			w={{
				// base: "full",
				// sm: "55vw",
				// md: "13.5vw",
				// lg: "225px",
				// xl: "250px",
				// "2xl": "250px",
				base: "250px",
			}}
			bgColor={"accent.DEFAULT"}
			height={"100%"}
		>
			<Flex direction="column">
				<Box borderRight="12px" height={"100%"} w={"100%"}>
					{userData?.is_org_admin !== 1 && (
						<>
							<ProfileCard
								key={"profileStatus"}
								name={userData?.userDetails?.name}
								mobileNumber={userData?.userDetails?.mobile}
								img={userData?.userDetails?.pic}
							/>

							<StatusCard key={"walletStatus"} />
						</>
					)}

					{menuList?.map((menu, index) => {
						switch (true) {
							case menu.subLevel && menu.api:
								return (
									<CollapseMenu
										key={menu.name}
										menu={menu}
										interaction_list={interaction_list}
										role={userData?.role}
									/>
								);
							case menu.subLevel && menu.subLevelObject != null:
								return (
									<CollapseMenu
										key={menu.name}
										menu={menu}
										interaction_list={menu.subLevelObject}
										role={userData?.role}
									/>
								);
							default:
								return (
									<LinkMenu
										key={menu.name}
										menu={menu}
										index={index}
										role={userData?.role}
									/>
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
const MenuBar = (props) => {
	const { navOpen, setNavOpen } = props;
	const router = useRouter();
	const { /* isOpen, onOpen, */ onClose } = useDisclosure();
	useEffect(() => {
		setNavOpen(false);
	}, [router.asPath]);
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
				<SideBarMenu setNavOpen={setNavOpen} />
			</DrawerContent>
		</Drawer>
	);
};

const CollapseMenu = (props) => {
	const { menu, interaction_list, /* currentRoute, */ role } = props;
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
										<Link key={item.label} href={link}>
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
	const { menu, /* currentRoute, */ index, role } = props;
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
