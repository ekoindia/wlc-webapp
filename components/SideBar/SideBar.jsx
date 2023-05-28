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
	Image,
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
import { useRegisterActions } from "kbar";
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
const isCurrentRoute = (routerUrl, path) => {
	if (!routerUrl || !path) return false;

	const [routePath] = routerUrl.split("?");

	if (routePath === "/admin") {
		return path === "/admin";
	}

	return (path + "/").startsWith(routePath + "/");
};

/**
 * Component to show icon or first letter of the name
 */
const ActionIcon = ({
	name,
	icon,
	ext_icon,
	size = "sm",
	color = "#64748b",
}) => {
	return (
		<Circle
			size={size === "sm" ? "10" : "12"}
			bg={ext_icon ? "white" : color}
			borderRadius={ext_icon ? 0 : "full"}
			color="white"
			fontSize={size === "sm" ? "md" : "lg"}
			fontWeight="500"
			overflow="hidden"
		>
			{ext_icon ? (
				<Image
					src={ext_icon}
					alt={name}
					w="full"
					h="full"
					objectFit="contain"
				/>
			) : icon && !ext_icon ? (
				<Icon name={icon} size={size} />
			) : (
				name[0]
			)}
		</Circle>
	);
};

/**
 * A helper function to create the KBar actions array from all the visible transactions from transaction_list which are part of role_transaction_list.
 * @param {Array} interaction_list - List of all transactions
 * @param {Object} role_tx_list - All transaction_ids that are allowed to the user (mapped to the trxn details)
 * @returns {Array} Array of KBar actions
 */
const generateTransactionActions = (
	interaction_list,
	role_tx_list,
	Icon,
	router,
	is_other_list = false
) => {
	const getTxAction = (tx, parent_id, is_group) => {
		const _id = "" + (parent_id ? `${parent_id}/` : "") + tx.id;

		return {
			id: "tx/" + _id,
			name: tx.label,
			subtitle: tx.description || tx.desc || "",
			keywords: "transaction " + (tx.category || ""),
			icon: (
				<ActionIcon
					icon={tx.icon}
					ext_icon={tx.ext_icon}
					name={tx.label}
				/>
			),
			section: "Services",
			perform: is_group ? null : () => router.push("/transaction/" + _id),
			parent: parent_id
				? "tx/" + parent_id
				: is_other_list
				? null
				: "start-a-tx",
		};
	};

	const trxnList = is_other_list
		? []
		: [
				{
					id: "start-a-tx",
					name: "Start a Transaction...",
					// keywords: "dmt bbps recharge billpay product earn send cashin cashout transfer",
					icon: <Icon name="transaction" size="sm" color="#334155" />,
					shortcut: ["$mod+/"],
					section: "Services",
				},
		  ];

	// Cache for transactions that contain sub-transactions
	const trxnGroups = [];

	// Process main transactions
	interaction_list.forEach((tx) => {
		if (tx.id in role_tx_list) {
			let is_group = false;
			// Is this a transaction group (Grid) (i.e, contains sub-transactions)?
			if (tx.behavior == 7 && tx?.group_interaction_ids?.length) {
				is_group = true;
				trxnGroups.push({
					tx: tx,
					parent: "" + tx.id,
				});
			}
			trxnList.push(getTxAction(tx, null, is_group));
		}
	});

	// Recusrively process transaction groups...
	while (trxnGroups.length > 0) {
		const group = trxnGroups.shift();
		const { tx, parent } = group;
		const group_interaction_ids = tx.group_interaction_ids.split(",");
		group_interaction_ids.forEach((id) => {
			const subTx = role_tx_list[id];
			if (subTx) {
				const thisTx = {
					id: id,
					...subTx,
				};
				let is_group = false;
				// Is this a transaction group (i.e, contains sub-transactions)?
				if (
					subTx.behavior == 7 &&
					subTx?.group_interaction_ids?.length > 0
				) {
					is_group = true;
					trxnGroups.push({
						tx: thisTx,
						parent: "" + (parent ? `${parent}/` : "") + id,
					});
				}
				trxnList.push(getTxAction(thisTx, parent, is_group));
			}
		});
	}

	return trxnList;
};

//MAIN EXPORT
const SideBar = ({ navOpen, setNavClose }) => {
	const { userData, isAdmin, userType } = useUser();
	const { interactions } = useMenuContext();
	const { interaction_list, role_tx_list } = interactions;
	const router = useRouter();
	const [trxnList, setTrxnList] = useState([]);
	const [otherList, setOtherList] = useState([]);
	const [openIndex, setOpenIndex] = useState(-1);
	const [trxnActions, setTrxnActions] = useState([]);
	const [otherActions, setOtherActions] = useState([]);

	// const [trxnActionsWorker] = useWorker(generateTransactionActions);

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

			// Add manage-my-account to the otherList
			let manageMyAccount = {
				id: TransactionIds.MANAGE_MY_ACCOUNT,
				...role_tx_list[TransactionIds.MANAGE_MY_ACCOUNT],
			};
			// Remove, if already present in the list
			if (manageMyAccount?.is_visible === 1) {
				manageMyAccount = null;
			}

			setTrxnList(trxnList);
			setOtherList([
				{
					icon: "transaction-history",
					label: "Transaction History",
					link: Endpoints.HISTORY,
				},
				...otherList,
				manageMyAccount,
			]);

			console.log("⌘ K Bar ------------- ", role_tx_list[268]);

			// Generate KBar actions...
			setTrxnActions(
				generateTransactionActions(trxnList, role_tx_list, Icon, router)
			);
			setOtherActions(
				generateTransactionActions(
					[...otherList, manageMyAccount],
					role_tx_list,
					Icon,
					router,
					true // is-other-list
				)
			);
		}
	}, [interaction_list]);

	// useEffect(() => {
	// 	if (interaction_list && interaction_list.length > 0) {
	// 		const _trxnActions = generateTransactionActions(
	// 			interaction_list,
	// 			role_tx_list,
	// 			Icon,
	// 			router
	// 		);
	// 		setTrxnActions(_trxnActions);
	// 	}
	// }, [interaction_list, role_tx_list]);

	useRegisterActions(trxnActions, [trxnActions]);
	useRegisterActions(otherActions, [otherActions]);

	// Set the sub-menu (accordian) index that should be open by default
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
		openIndex,
		setOpenIndex,
	};

	return (
		<>
			<Box display={{ base: "flex", lg: "none" }}>
				<SmallScreenSideMenu
					{...otherProps}
					navOpen={navOpen}
					setNavClose={setNavClose}
				/>
			</Box>
			<Box
				display={{ base: "none", lg: "flex" }}
				sx={{
					"@media print": {
						display: "none",
					},
				}}
			>
				<SideBarMenu {...otherProps} />
			</Box>
		</>
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
	openIndex,
	setOpenIndex,
}) => {
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
	if (isAdmin) return null;

	// Hide if nothing to show...
	if (!(trxnList?.length > 0 || otherList?.length > 0)) return null;

	return (
		<Accordion
			allowToggle
			w="100%"
			textColor="white"
			index={openIndex}
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
