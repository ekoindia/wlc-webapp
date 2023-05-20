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
import {
	adminSidebarMenu,
	Endpoints,
	OtherMenuItems,
	sidebarMenu,
	TransactionIds,
	UserType,
} from "constants";
import { useMenuContext } from "contexts/MenuContext";
import { useUser } from "contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Icon, ProfileCard, StatusCard } from "..";

/**
 * A helper function to check if the current route is the same as the route passed to it.
 * @param {Object} routerUrl The current route URL.
 * @param {string} path The path to compare with the current route.
 * @returns {boolean} True if the current route is the same as the route passed to it.
 **/
function isCurrentRoute(routerUrl, path) {
	if (!routerUrl || !path) return false;

	const [routePath] = routerUrl.split("?");

	if (routePath === "/admin") {
		return path === "/admin";
	}

	return (path + "/").startsWith(routePath + "/");
}

//MAIN EXPORT
const SideBar = (props) => {
	return (
		<>
			<Box display={{ base: "flex", lg: "none" }}>
				<SmallScreenSideMenu {...props} />
			</Box>
			<Box
				display={{ base: "none", lg: "flex" }}
				sx={{
					"@media print": {
						display: "none",
					},
				}}
			>
				<SideBarMenu />
			</Box>
		</>
	);
};

export default SideBar;

//FOR LAPTOP SCREENS
const SideBarMenu = () => {
	const { userData, isAdmin, userType } = useUser();
	const { interactions } = useMenuContext();
	const { interaction_list } = interactions;
	const router = useRouter();
	const [trxnList, setTrxnList] = useState([]);
	const [otherList, setOtherList] = useState([]);

	const is_distributor =
		[UserType.DISTRIBUTOR, UserType.SUPER_DISTRIBUTOR].indexOf(userType) >
		-1;

	const menuList = isAdmin ? adminSidebarMenu : sidebarMenu;

	// Split the transaction list into two lists:
	// 1. trxnList: List of transactions/products
	// 2. otherList: List of other menu items
	useEffect(() => {
		if (interaction_list && interaction_list.length > 0) {
			const trxnList = [];
			const otherList = [];

			interaction_list.forEach((tx) => {
				if (OtherMenuItems.indexOf(tx.id) > -1) {
					otherList.push(tx);
				} else {
					trxnList.push(tx);
				}
			});

			setTrxnList(trxnList);
			setOtherList([
				{
					icon: "transaction-history",
					label: "Transaction History",
					link: Endpoints.HISTORY,
				},
				...otherList,
				{
					icon: "manage",
					label: "Manage My Account",
					id: TransactionIds.MANAGE_MY_ACCOUNT,
				},
			]);
		}
	}, [interaction_list]);

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
			overflowY="auto"
		>
			<Flex direction="column">
				<Box borderRight="12px" height={"100%"} w={"100%"}>
					{/* Show user-profile card and wallet balance for agents (non-admin users) */}
					{!isAdmin && (
						<>
							<Link href={Endpoints.USER_PROFILE}>
								<ProfileCard
									name={userData?.userDetails?.name}
									mobileNumber={userData?.userDetails?.mobile}
									img={userData?.userDetails?.pic}
									cursor="pointer"
								/>
							</Link>

							<StatusCard />
						</>
					)}

					{/* Fixed menu items */}
					{menuList?.map((menu, index) => (
						<LinkMenuItem
							key={menu.name}
							menu={menu}
							index={index}
						/>
					))}

					{/* Dynamic menu items */}
					<AccordionMenu
						trxnList={trxnList}
						otherList={otherList}
						router={router}
						isAdmin={isAdmin}
						isDistributor={is_distributor}
					/>
				</Box>
				{/* {rest.children} */}
			</Flex>
		</Box>
	);
};

//FOR MOBILE SCREENS
const SmallScreenSideMenu = (props) => {
	const { navOpen, setNavOpen } = props;
	const router = useRouter();
	const { /* isOpen, onOpen, */ onClose } = useDisclosure();

	// Close navigation drawer on page change
	useEffect(() => {
		setNavOpen(false);
	}, [router.asPath, setNavOpen]);

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

/**
 * Transaction Submenu Section for non-admin users
 * @param {Array} trxnList - List of "transactions" submenu items
 * @param {Array} otherList - List of "other" submenu items
 * @param {Object} router - Next.js router object
 * @param {Boolean} isAdmin - Flag to check if user is an admin
 * @param {Boolean} isDistributor - Flag to check if user is a distributor
 */
const AccordionMenu = ({
	trxnList = [],
	otherList = [],
	router,
	isAdmin,
	isDistributor,
}) => {
	const [openIndex, setOpenIndex] = useState(-1);

	// Hide transaction sub-menus for admin...
	if (isAdmin) return null;

	// Hide if nothing to show...
	if (!(trxnList?.length > 0 || otherList?.length > 0)) return null;

	const defaultExpandIndex = isDistributor
		? 1
		: trxnList?.length > 0
		? 0
		: -1;

	return (
		<Accordion
			allowToggle
			w="100%"
			textColor="white"
			defaultIndex={defaultExpandIndex}
			onChange={setOpenIndex}
		>
			{/* Start A Transaction... */}
			{trxnList?.length > 0 && (
				<AccordionSubMenuSection
					title="Start a Transaction"
					icon="transaction"
					menuItems={trxnList}
					router={router}
					expanded={openIndex === 0}
				/>
			)}

			{/* Others... */}
			{otherList?.length > 0 && (
				<AccordionSubMenuSection
					title="Others"
					icon="others"
					menuItems={otherList}
					router={router}
					expanded={openIndex === 1}
				/>
			)}
		</Accordion>
	);
};

const AccordionSubMenuSection = ({
	title,
	icon,
	menuItems,
	router,
	expanded,
}) => {
	return (
		<AccordionItem borderBottom="br-sidebar" borderTop="none">
			<h2>
				<AccordionButton
					pl={{
						base: "5",
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
							<Icon name={icon} size="sm" />
							<Text
								fontSize={{
									base: "14px",
									"2xl": "16px",
								}}
							>
								{title}
							</Text>
						</Flex>
						<Circle bg="sidebar.icon-bg" size="5">
							<Icon
								size="10px"
								name={expanded ? "remove" : "expand-add"}
							/>
						</Circle>
					</Flex>
				</AccordionButton>
			</h2>

			<AccordionPanel padding={"0px"} border="none">
				{menuItems?.map((tx) => {
					const link = tx?.link || `/transaction/${tx?.id}`;
					const isCurrent = isCurrentRoute(router.asPath, link);
					return (
						<Link key={link} href={link}>
							<Box
								w="100%"
								padding="0px 14px 0px 40px"
								bg={isCurrent ? "sidebar.active-bg" : ""}
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
								transitionProperty="border-left-color, background-color"
								transitionDuration="0.3s"
								transitionTimingFunction="ease-out"
							>
								<Flex
									align="center"
									justify="space-between"
									padding="12px 0px 12px 0px"
									borderTop="br-sidebar"
									borderTopStyle="dashed"
								>
									<Flex align="center" columnGap="10px">
										<Icon name={tx.icon} size="sm" />
										<Text
											fontSize={{
												base: "12px",
												"2xl": "14px",
											}}
										>
											{tx.label}
										</Text>
									</Flex>
									<Icon
										color={
											isCurrent ? "#FE7D00" : "#556FEF"
										}
										name="chevron-right"
										size="xs"
										// transition="color 0.3s ease-out"
									/>
								</Flex>
							</Box>
						</Link>
					);
				})}
			</AccordionPanel>
		</AccordionItem>
	);
};

const LinkMenuItem = ({ menu, /* currentRoute, */ index }) => {
	const router = useRouter();
	const isCurrent = isCurrentRoute(router.asPath, menu.link);

	return (
		<Link href={menu.link} key={index}>
			<Flex
				key={index}
				fontSize={{
					base: "14px",
					"2xl": "16px",
				}}
				color="white"
				align="center"
				gap="13px"
				px={{
					base: "3",
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
				transitionProperty="border-left-color, background-color"
				transitionDuration="0.3s"
				transitionTimingFunction="ease-out"
			>
				<Icon name={menu.icon} size="sm" />
				{menu.name}
			</Flex>
		</Link>
	);
};
