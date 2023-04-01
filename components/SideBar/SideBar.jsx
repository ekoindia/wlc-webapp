import { MinusIcon } from "@chakra-ui/icons";
import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Box,
	Center,
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

function isCurrentRoute(router, currPath, role) {
	const path = router.asPath.split("?")[0];
	// console.log("roles", path.split("/"));
	const currentRoute =
		role === roles["admin"] ? path.split("/")[2] : path.split("/")[1];
	if (role === roles["admin"] && currentRoute === currPath.split("/")[2]) {
		return true;
	}
	if (
		role === roles["non-admin"] &&
		// currentRoute === currPath.split("/")[1] ||
		currPath === path
	)
		return true;
}

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

	const menuList = userData?.role === "admin" ? adminMenu : nonAdminMenu;

	return (
		<Box
			minW={{
				base: "full",
				sm: "55vw",
				md: "13.5vw",
				lg: "200px",
				xl: "200px",
				"2xl": "250px",
			}}
			bgColor={"accent.DEFAULT"}
			height={"100%"}
		>
			<Flex>
				<Box
					bg="accent.DEFAULT"
					borderRight="12px"
					height={"100%"}
					w={"full"}
				>
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

//EXPORT
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
								paddingLeft={{
									base: "5",
									md: "5",
									lg: "4",
									"2xl": "6",
								}}
								py={{
									base: "4",
									md: "3",
									xl: "3",
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
										<Center
											w={{
												base: "20px",
												sm: "20px",
												md: "18px",
												lg: "18px",
												xl: "18px",
												"2xl": "27px",
											}}
											h={{
												base: "20px",
												sm: "20px",
												md: "18px",
												lg: "18px",
												xl: "18px",
												"2xl": "20px",
											}}
										>
											<Icon
												name={menu.icon}
												width={"100%"}
											/>
										</Center>
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
									<Circle bg="icon_bg_blue" size="5">
										{!isExpanded ? (
											<Icon name="expand" width="10px" />
										) : (
											<Icon name="remove" width="10px" />
										)}
									</Circle>
								</Flex>
							</AccordionButton>

							<AccordionPanel padding={"0px"} border="none">
								{interaction_list?.map((item, index) => {
									const link =
										item.link || `/transaction/${item?.id}`;
									return (
										<Link key={index} href={link}>
											<Box
												w="100%"
												padding="0px 14px 0px 40px"
												bg={
													isCurrentRoute(
														router,
														link,
														role
													)
														? "sidebar.active-bg"
														: ""
												}
												borderLeft="8px"
												borderLeftColor={
													isCurrentRoute(
														router,
														link,
														role
													)
														? "sidebar.active-border"
														: "transparent"
												}
												outline={
													isCurrentRoute(
														router,
														link,
														role
													)
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
														<MinusIcon fontSize="12px" />
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
															isCurrentRoute(
																router,
																link,
																role
															)
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
				gap="13px"
				color="white"
				align="center"
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
				bg={
					isCurrentRoute(router, menu.link, role)
						? "sidebar.active-bg"
						: ""
				}
				borderLeft="8px"
				borderLeftColor={
					isCurrentRoute(router, menu.link, role)
						? "sidebar.active-border"
						: "transparent"
				}
			>
				<Center
					w={{
						base: "20px",
						sm: "20px",
						md: "18px",
						lg: "18px",
						xl: "18px",
						"2xl": "27px",
					}}
					h={{
						base: "20px",
						sm: "20px",
						md: "18px",
						lg: "18px",
						xl: "18px",
						"2xl": "20px",
					}}
				>
					<Icon name={menu.icon} width={"100%"} />
				</Center>
				{menu.name}
			</Flex>
		</Link>
	);
};

const WalletBalance = () => {
	return (
		<Flex>
			<Flex>data 1</Flex>
		</Flex>
	);
};
