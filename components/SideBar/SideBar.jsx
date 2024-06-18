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
	// Tooltip,
	useBreakpointValue,
	useDisclosure,
	useToken,
} from "@chakra-ui/react";
import { Endpoints, UserType } from "constants";
import { useMenuContext, useUser } from "contexts";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { svgBgDotted } from "utils/svgPatterns";
import { /* AdminViewToggleCard, */ Icon, ProfileCard, StatusCard } from "..";

/**
 * A helper function to check if the current route is the same as the route passed to it.
 * @param {Object} routerUrl The current route URL.
 * @param {string} path The path to compare with the current route.
 * @returns {boolean} True if the current route is the same as the route passed to it.
 **/
const isCurrentRoute = (routerUrl, path) => {
	if (!routerUrl || !path) return false;

	const [routePath] = routerUrl.split("?");

	if (routePath === "/admin") {
		return path === "/admin";
	}

	return (path + "/").startsWith(routePath + "/");
};

//MAIN EXPORT
const SideBar = ({ navOpen, setNavClose }) => {
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
	const isSmallScreen = useBreakpointValue(
		{ base: true, lg: false },
		{ ssr: false }
	);

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

	return isSmallScreen ? ( // Mobile sidebar with drawer
		<Box
			sx={{
				"@media print": {
					display: "none",
				},
			}}
		>
			<SmallScreenSideMenu
				{...otherProps}
				navOpen={navOpen}
				setNavClose={setNavClose}
			/>
		</Box>
	) : (
		// Desktop sidebar
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
};

export default SideBar;

//FOR LAPTOP SCREENS
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
			bg="sidebar.bg" // ORIG_THEME: primary.DEFAULT
			color="sidebar.text" // ORIG_THEME: "white"
			height={"100%"}
			backgroundImage={svgBgDotted({
				fill: contrast_color,
			})}
			overflowY="auto"
		>
			<Flex direction="column">
				<Box borderRight="12px" height={"100%"} w={"100%"}>
					{/* Show user-profile card and wallet balance for agents (non-admin users) */}
					{!isAdmin && (
						<Link href={Endpoints.USER_PROFILE}>
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
					{menuList?.map((menu, index) => (
						<LinkMenuItem
							key={menu.name}
							menu={menu}
							index={index}
							isAdminAgentMode={isAdminAgentMode}
						/>
					))}

					{/* Dynamic menu items */}
					<AccordionMenu
						trxnList={trxnList}
						otherList={otherList}
						router={router}
						isAdmin={isAdmin}
						openIndex={openIndex}
						setOpenIndex={setOpenIndex}
					/>
				</Box>
				{/* {rest.children} */}
			</Flex>
		</Box>
	);
};

//FOR MOBILE SCREENS
const SmallScreenSideMenu = ({ navOpen, setNavClose, ...rest }) => {
	const router = useRouter();
	const { /* isOpen, onOpen, */ onClose } = useDisclosure();

	// Close navigation drawer on page change
	useEffect(() => {
		setNavClose();
	}, [router.asPath, setNavClose]);

	return (
		<Drawer
			autoFocus={false}
			isOpen={navOpen}
			placement="left"
			onClose={onClose}
			returnFocusOnClose={false}
			onOverlayClick={setNavClose}
			size="full"
		>
			<DrawerOverlay />
			<DrawerContent maxW="250px" boxShadow={"none"}>
				<SideBarMenu {...rest} />
				{/* setNavClose={setNavClose} */}
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
					const link =
						tx?.link ||
						`${isAdmin ? "/admin" : ""}/transaction/${tx?.id}`;
					const isCurrent = isCurrentRoute(router.asPath, link);
					return (
						<Link key={link} href={link}>
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

const LinkMenuItem = ({
	menu,
	/* currentRoute, */ index,
	isAdminAgentMode,
}) => {
	const router = useRouter();
	const link = (isAdminAgentMode ? "/admin" : "") + menu.link;
	const isCurrent = isCurrentRoute(router.asPath, link);

	return (
		<Link href={link} key={index}>
			<Flex
				key={index}
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
				borderBottom="1px solid" // ORIG_THEME: br-sidebar
				borderBottomColor="sidebar.divider" // ORIG_THEME: primary.light
				bg={isCurrent ? "sidebar.sel" : ""} //ORIG_THEME: sidebar.active-bg
				_hover={{
					background: "sidebar.sel",
					color: "white",
				}}
				borderLeft="8px"
				borderLeftColor={
					isCurrent ? "accent.dark" : "transparent" // ORIG_THEME: sidebar.active-border
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
