import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Box,
	Circle,
	Flex,
	Text,
	useToken,
} from "@chakra-ui/react";
import { useBottomAppBarItems } from "components/BottomAppBar";
import { Endpoints, InteractionBehavior, UserType } from "constants";
import { useMenuContext, useUser } from "contexts";
import { useFeatureFlag, useLocalStorage } from "hooks";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { svgBgDotted } from "utils/svgPatterns";
import {
	/* AdminViewToggleCard, */
	Icon,
	ProfileCard,
	StatusCard,
	Tags,
} from "..";

// Lazy-load the BottomAppBar component (for icon-only compact side-bar view)
const BottomAppBar = dynamic(
	() => import("components/BottomAppBar").then((pkg) => pkg.BottomAppBar),
	{
		ssr: false,
	}
);

/**
 * A helper function to check if the current route is the same as the route passed to it.
 * @param {object} routerUrl The current route URL.
 * @param {string} path The path to compare with the current route.
 * @returns {boolean} True if the current route is the same as the route passed to it.
 */
const isCurrentRoute = (routerUrl, path) => {
	if (!routerUrl || !path) return false;

	const [routePath] = routerUrl.split("?");

	if (routePath === "/admin") {
		return path === "/admin";
	}

	return (path + "/").startsWith(routePath + "/");
};

/**
 * Sidebar to show the left-hand navigation menu
 * MARK: SideBar
 * @returns {JSX.Element} A sidebar component
 */
const SideBar = () => {
	const {
		isLoggedIn,
		isOnboarding,
		userData,
		isAdmin,
		isAdminAgentMode,
		userType,
	} = useUser();

	const { trxnList, menuList, otherList } = useMenuContext();
	const router = useRouter();
	const [openIndex, setOpenIndex] = useState(-1);

	// Check if screen is smaller than "lg" to show a mobile sidebar with drawer
	// const isSmallScreen = useBreakpointValue(
	// 	{ base: true, lg: false },
	// 	{ ssr: false }
	// );

	// Set the sub-menu (accordion) index that should be open by default
	// For Distributors, open the "Other" submenu (index = 1)
	// For Agents, open the "Start a Transaction" submenu (index = 0)
	useEffect(() => {
		const isDistributor =
			[UserType.DISTRIBUTOR, UserType.SUPER_DISTRIBUTOR].indexOf(
				userType
			) > -1;
		setOpenIndex(isDistributor ? 1 : trxnList?.length > 0 ? 0 : -1);
	}, [userType, trxnList?.length]);

	const otherProps = {
		userData,
		menuList,
		trxnList,
		otherList,
		router,
		isAdmin,
		isAdminAgentMode,
		openIndex,
		setOpenIndex,
	};

	// If not logged-in or onboarding, don't show the sidebar
	if (isLoggedIn !== true || isOnboarding) {
		return null;
	}

	// Desktop sidebar
	return (
		<Box
			sx={{
				"@media print": {
					display: "none",
				},
			}}
		>
			<SideBarMenu {...otherProps} />
		</Box>
	);

	// return isSmallScreen ? ( // Mobile sidebar with drawer
	// 	<Box
	// 		sx={{
	// 			"@media print": {
	// 				display: "none",
	// 			},
	// 		}}
	// 	>
	// 		<SmallScreenSideMenu
	// 			{...{ isSidebarOpen, closeSidebar, ...otherProps }}
	// 		/>
	// 	</Box>
	// ) : (
	// 	// Desktop sidebar
	// 	<Box
	// 		sx={{
	// 			"@media print": {
	// 				display: "none",
	// 			},
	// 		}}
	// 	>
	// 		<SideBarMenu {...otherProps} />
	// 	</Box>
	// );
};

export default SideBar;

/**
 * Sidebar Menu with status card, profile card, and navigation menu items.
 * This is shown on larger screens.
 * MARK: SideBarMenu
 * @param {object} props
 * @param {object} props.userData - The user data object
 * @param {Array} props.menuList - List of fixed menu items
 * @param {Array} props.trxnList - List of "transactions" submenu items
 * @param {Array} props.otherList - List of "other" submenu items
 * @param {object} props.router - Next.js router object
 * @param {boolean} props.isAdmin - Flag to check if user is an admin
 * @param {boolean} props.isAdminAgentMode - Flag to check if user is in admin-agent mode
 * @param {number} props.openIndex - The index of the open accordion menu
 * @param {Function} props.setOpenIndex - Function to set the open accordion menu index
 * @returns {JSX.Element} A sidebar menu component
 */
const SideBarMenu = ({
	userData,
	menuList,
	trxnList,
	otherList,
	router,
	isAdmin,
	isAdminAgentMode,
	openIndex,
	setOpenIndex,
}) => {
	// Get theme color values
	const [contrast_color] = useToken("colors", ["sidebar.dark"]);

	// Feature-Flag for Compact-Mode
	const [isCompactSidebarEnabled] = useFeatureFlag("COMPACT_SIDEBAR");

	// Compact Mode Setting
	const [isCompactView, setIsCompactView] = useLocalStorage(
		"inf-compactsidebar",
		false,
		{
			dontStoreInitialValue: true,
		}
	);

	// Get the bottom-bar items (for compact side-bar view)
	const bottomAppBarItems = useBottomAppBarItems({ isSideBarMode: true });

	const showOtherListAsMainList =
		isAdmin !== true && trxnList?.length === 0 && otherList?.length > 0;

	// if (isCompactView) {
	// 	return <BottomAppBar items={bottomAppBarItems} isSideBarMode={true} />;
	// }

	return (
		<Box
			className="sidebar"
			position="relative"
			w={
				isCompactView
					? "80px"
					: {
							// base: "full",
							// sm: "55vw",
							// md: "13.5vw",
							// lg: "225px",
							// xl: "250px",
							// "2xl": "250px",
							base: "250px",
						}
			}
			bg="sidebar.bg" // ORIG_THEME: primary.DEFAULT
			color="sidebar.text" // ORIG_THEME: "white"
			height={"100%"}
			py={isCompactView ? "20px" : 0}
			backgroundImage={svgBgDotted({
				fill: contrast_color,
			})}
			overflowY="auto"
		>
			{isCompactSidebarEnabled && isCompactView ? (
				<BottomAppBar items={bottomAppBarItems} isSideBarMode={true} />
			) : (
				<Flex direction="column">
					<Box borderRight="12px" height={"100%"} w={"100%"}>
						{/* Show user-profile card and wallet balance for agents (non-admin users) */}
						{!isAdmin && (
							<Link
								href={Endpoints.USER_PROFILE}
								prefetch={false}
							>
								<ProfileCard
									name={userData?.userDetails?.name}
									mobileNumber={userData?.userDetails?.mobile}
									img={userData?.userDetails?.pic}
									cursor="pointer"
								/>
							</Link>
						)}

						{/* {isAdmin && <AdminViewToggleCard />} */}

						<StatusCard />

						{/* Fixed menu items */}
						{menuList?.map((menu) => (
							<LinkMenuItem
								key={menu.id || menu.name || menu.label}
								menu={menu}
								isAdminAgentMode={isAdminAgentMode}
							/>
						))}

						{/* Others menu items as fixed items (if normal) */}
						{showOtherListAsMainList
							? otherList?.map((menu) => (
									<LinkMenuItem
										key={menu.id || menu.label}
										menu={menu}
										isAdminAgentMode={isAdminAgentMode}
									/>
								))
							: null}

						{/* Dynamic menu items */}
						{showOtherListAsMainList ? null : (
							<AccordionMenu
								trxnList={trxnList}
								otherList={otherList}
								router={router}
								isAdmin={isAdmin}
								openIndex={openIndex}
								setOpenIndex={setOpenIndex}
							/>
						)}
					</Box>
					{/* {rest.children} */}

					{/* Extra padding at the bottom */}
					<Box h="100px" />
				</Flex>
			)}

			{/* Button to toggle Compact-View for Sidebar */}
			{isCompactSidebarEnabled ? (
				<Flex
					position="fixed"
					align="center"
					justify="center"
					bottom="0"
					left="0"
					w="35px"
					h="35px"
					borderRadius="0 99px 99px 0"
					bg="white"
					color="primary.DEFAULT"
					cursor="pointer"
					boxShadow="base"
					opacity="0.8"
					area-label={
						isCompactView ? "Expand Sidebar" : "Collapse Sidebar"
					}
					onClick={() =>
						isCompactSidebarEnabled &&
						setIsCompactView(!isCompactView)
					}
				>
					<Icon
						name="chevron-left"
						transform={
							isCompactView ? "rotate(180deg)" : "rotate(0)"
						}
						transition="transform 0.2s ease-out"
						size="xs"
					/>
				</Flex>
			) : null}
		</Box>
	);
};

//FOR MOBILE SCREENS
// const SmallScreenSideMenu = ({ isSidebarOpen, closeSidebar, ...rest }) => {
// 	const router = useRouter();

// 	// Close navigation drawer on page change
// 	useEffect(() => {
// 		closeSidebar();
// 	}, [router.asPath]);

// 	return (
// 		<Drawer
// 			autoFocus={false}
// 			isOpen={isSidebarOpen}
// 			placement="left"
// 			onClose={closeSidebar}
// 			returnFocusOnClose={false}
// 			onOverlayClick={closeSidebar}
// 			size="full"
// 		>
// 			<DrawerOverlay />
// 			<DrawerContent maxW="250px" boxShadow={"none"}>
// 				<SideBarMenu {...rest} />
// 			</DrawerContent>
// 		</Drawer>
// 	);
// };

/**
 * Transaction Submenu Section for non-admin users
 * MARK: AccordianMenu
 * @param trxnList.trxnList
 * @param {Array} trxnList - List of "transactions" submenu items
 * @param {Array} otherList - List of "other" submenu items
 * @param {object} router - Next.js router object
 * @param {boolean} isAdmin - Flag to check if user is an admin
 * @param {number} openIndex - The index of the open accordion menu
 * @param {Function} setOpenIndex - Function to set the open accordion menu index
 * @param trxnList.otherList
 * @param trxnList.router
 * @param trxnList.isAdmin
 * @param trxnList.openIndex
 * @param trxnList.setOpenIndex
 * @returns {JSX.Element} An accordion menu component
 */
const AccordionMenu = ({
	trxnList = [],
	otherList = [],
	router,
	isAdmin,
	openIndex,
	setOpenIndex,
}) => {
	// Hide transaction sub-menus for admin...
	// if (isAdmin) return null;

	// Hide if nothing to show...
	if (!(trxnList?.length > 0 || otherList?.length > 0)) return null;

	const showTrxnSubMenu = trxnList?.length > 0;
	const showOtherSubMenu = otherList?.length > 0;
	const otherMenuIndex = showTrxnSubMenu ? 1 : 0;

	return (
		<Accordion
			allowToggle
			w="100%"
			// textColor="white"
			index={openIndex}
			onChange={setOpenIndex}
		>
			{/* Start A Transaction... */}
			{showTrxnSubMenu && (
				<AccordionSubMenuSection
					title="Start a Transaction"
					icon="transaction"
					menuItems={trxnList}
					router={router}
					expanded={openIndex === 0}
					isAdmin={isAdmin}
				/>
			)}

			{/* Others... */}
			{showOtherSubMenu && (
				<AccordionSubMenuSection
					title="Others"
					icon="others"
					menuItems={otherList}
					router={router}
					expanded={openIndex === otherMenuIndex}
					isAdmin={isAdmin}
				/>
			)}
		</Accordion>
	);
};

/**
 * An expandable section with a list of menu items. For example, "Start a Transaction" or "Others", and their respective sub-items.
 * MARK: Section
 * @param {string} title - The title of the section
 * @param {string} icon - The icon name of the section
 * @param {Array} menuItems - The list of menu items
 * @param {object} router - Next.js router object
 * @param {boolean} expanded - If the section is expanded
 * @param {boolean} isAdmin - If the user is an admin
 * @returns {JSX.Element} An accordion section component
 */
const AccordionSubMenuSection = ({
	title,
	icon,
	menuItems,
	router,
	expanded,
	isAdmin,
}) => {
	return (
		<AccordionItem
			borderBottom="1px solid" // ORIG_THEME: "br-sidebar"
			borderBottomColor="sidebar.divider" // ORIG_THEME: primary.light
			borderTop="none"
		>
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
						<Circle
							bg="sidebar.divider" // ORIG_THEME: sidebar.icon-bg
							size="5"
						>
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
					if (!tx) return null;

					let link;
					if (tx.link) {
						link = tx.link;
					} else if (
						tx.behavior === InteractionBehavior.REDIRECT &&
						tx.uri
					) {
						link = tx.uri;
					} else if (tx.id) {
						link = `${isAdmin ? "/admin" : ""}/transaction/${tx.id}`;
					} else {
						// No link or id provided
						return null;
					}

					const isCurrent = isCurrentRoute(router.asPath, link);
					return (
						<Link key={tx.id || link} href={link} prefetch={false}>
							<Box
								w="100%"
								padding="0px 14px 0px 40px"
								bg={
									isCurrent
										? "sidebar.sel" // ORIG_THEME: sidebar.active-bg
										: ""
								}
								borderLeft="8px"
								borderLeftColor={
									isCurrent
										? "accent.DEFAULT" // ORIG_THEME: sidebar.active-border
										: "transparent"
								}
								outline={
									isCurrent
										? "accent.light" // ORIG_THEME: "var(--chakra-borders-br-sidebar)"
										: ""
								}
								transitionProperty="border-left-color, background-color"
								transitionDuration="0.3s"
								transitionTimingFunction="ease-out"
							>
								{/* <Tooltip
									label={tx.description}
									hasArrow
									placement="right"
									openDelay={500}
									closeOnScroll
									gutter={20}
									// isDisabled={{ base: true, lg: false }}
								> */}
								<Flex
									align="center"
									justify="space-between"
									padding="12px 0px 12px 0px"
									borderTop="1px solid" // ORIG_THEME: "br-sidebar"
									borderTopColor="sidebar.divider" // ORIG_THEME: primary.light
									borderTopStyle="dashed"
									// tooltip={tx.description}
									// tooltip-config="right"
								>
									<Flex
										align="center"
										columnGap="10px"
										color={
											isCurrent ? "#FFF" : "sidebar.text"
										}
									>
										<Icon
											name={
												tx.icon ||
												"radio-button-unchecked"
											}
											size="sm"
										/>
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
											isCurrent
												? "accent.DEFAULT"
												: "primary.light"
										} // ORIG_THEME: "#FE7D00" : "#556FEF"
										name="chevron-right"
										size="xs"
										// transition="color 0.3s ease-out"
									/>
								</Flex>
								{/* </Tooltip> */}
							</Box>
						</Link>
					);
				})}
			</AccordionPanel>
		</AccordionItem>
	);
};

/**
 * It renders the first-level menu items (for example, Home, Dashboard, My Network, etc.)
 * MARK: Link Item
 * @param root0
 * @param root0.menu
 * @param root0.isAdminAgentMode
 */
const LinkMenuItem = ({
	menu,
	/* currentRoute, */
	isAdminAgentMode,
}) => {
	const router = useRouter();
	const link = menu.link
		? (isAdminAgentMode ? "/admin" : "") + menu.link
		: "";
	const id_link = menu?.id
		? `${isAdminAgentMode ? "/admin" : ""}/transaction/${menu?.id}`
		: "";
	const isCurrent = isCurrentRoute(router.asPath, link || id_link);

	return (
		<Link href={link || id_link} prefetch={false}>
			<Flex
				fontSize={{
					base: "14px",
					"2xl": "16px",
				}}
				color={isCurrent ? "white" : "sidebar.text"}
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
				w="full"
				role="group"
				cursor="pointer"
				borderBottom="1px solid"
				borderBottomColor="sidebar.divider"
				bg={isCurrent ? "sidebar.sel" : ""}
				_hover={{
					background: "sidebar.sel",
					color: "white",
				}}
				borderLeft="8px"
				borderLeftColor={isCurrent ? "accent.dark" : "transparent"}
				transitionProperty="border-left-color, background-color"
				transitionDuration="0.3s"
				transitionTimingFunction="ease-out"
				justify="space-between"
			>
				<Flex align="center" gap="13px">
					<Icon name={menu.icon} size="sm" />
					{menu.name || menu.label}
				</Flex>

				{menu?.beta ? (
					<Tags
						status="BETA"
						bg="accent.DEFAULT"
						color="white"
						borderRadius="full"
						h="14px"
						fontSize="8px"
						fontWeight="500"
						px="6px"
						border="none"
					/>
				) : null}
			</Flex>
		</Link>
	);
};
