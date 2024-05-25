import {
	Avatar,
	Box,
	Divider,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuList,
	Text,
	Tooltip,
	useBreakpointValue,
	useDisclosure,
	useToken,
} from "@chakra-ui/react";
import { useKBarReady } from "components/CommandBar";
import { Endpoints, TransactionIds } from "constants";
import { adminProfileMenu, profileMenu } from "constants/profileCardMenus";
import { useOrgDetailContext, useUser } from "contexts";
import { useClipboard, useFeatureFlag, useRaiseIssue } from "hooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
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

/**
 * The top app-bar component
 * @param {*} props
 * @param {function} props.setNavOpen - Function to expand the left-menu drawer (in mobile view)
 */
const NavBar = ({ setNavOpen }) => {
	const [isCardOpen, setIsCardOpen] = useState(false);

	return (
		<>
			{isCardOpen && (
				<Box
					display={{ base: "flex", sm: "none" }}
					width="100%"
					h="100%"
					position="fixed"
					zIndex="999"
				>
					<MyAccountCard {...{ setIsCardOpen }} />
				</Box>
			)}

			<Box as="nav" w="full" h={NavHeight}></Box>
			<Box
				as="section"
				top="0%"
				w="full"
				position="fixed"
				zIndex="99"
				boxShadow="0px 3px 10px #0000001A"
			>
				<Box as="nav" position="sticky" w="full" h={NavHeight}>
					<NavContent {...{ setNavOpen, setIsCardOpen }} />
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
	const { name, pic } = userDetails ?? {};
	const { orgDetail } = useOrgDetailContext();
	// const router = useRouter();
	const isMobile = useBreakpointValue({ base: true, md: false });

	// Check if CommandBar is loaded...
	const { ready } = useKBarReady();

	// Get theme color values
	const [contrast_color] = useToken("colors", ["navbar.dark"]);

	const { isOpen, onOpen, onClose } = useDisclosure();

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
		<HStack
			bg="navbar.bg"
			h="full"
			justifyContent="space-between"
			px={{ base: "4", xl: "6" }}
			backgroundImage={svgBgDotted({
				fill: contrast_color,
				opacity: 0.04,
			})}
		>
			{/* Left-side items of navbar */}
			<Flex align="center" flexGrow={isMobile ? 1 : 0}>
				<Flex align="center" minW={{ base: "auto", md: "250px" }}>
					{isOnboarding ? null : (
						<Icon
							name="menu"
							mr="12px"
							display={{
								base: "initial",
								lg: "none",
							}}
							onClick={() => setNavOpen(true)}
							aria-label="open menu"
						/>
					)}
					<OrgLogo
						orgDetail={orgDetail}
						size="md"
						dark={orgDetail?.metadata?.theme?.navstyle === "light"}
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
			</Flex>

			{/* Right-side items of navbar */}
			<Menu defaultIsOpen={false} isOpen={isOpen} onClose={onClose}>
				<MenuButton
					onClick={() => {
						onOpen();
						setIsCardOpen(true);
					}}
				>
					<Flex align="center" cursor="pointer" zIndex="10">
						<Box bg="navbar.bgAlt" padding="2px" borderRadius="50%">
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
								name={name ? name[0] : ""}
								lineHeight="3px"
								src={pic}
							/>
						</Box>
						{isAdmin ? (
							<Flex
								ml="0.5vw"
								h="2.3vw"
								justify="center"
								direction="column"
								display={{ base: "none", md: "flex" }}
								lineHeight={{
									base: "15px",
									lg: "16px",
									xl: "18px",
									"2xl": "22px",
								}}
							>
								<Flex align="center">
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
										{limitText(name || "", 12)}
									</Text>

									<Icon
										name="arrow-drop-down"
										size="xs"
										mt="2px"
										color="navbar.text"
									/>
								</Flex>
								<Text
									fontSize={{
										base: "10px",
										"2xl": "14px",
									}}
									color="navbar.textLight"
									textAlign="start"
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
						base: "100%",
						sm: "320px",
						"2xl": "349px",
					}}
					border="none"
					bg="transparent"
					boxShadow="none"
					borderRadius="0px"
					p="0px"
					mr={{
						base: "-0.9vw",
						lg: "-0.6vw",
					}}
					display={{ base: "none", sm: "block" }}
				>
					<MyAccountCard {...{ setIsCardOpen, onClose }} />
				</MenuList>
			</Menu>
		</HStack>
	);
};

/**
 * Show the user's account details in a card, whenever the top-right corner profile icon is clicked.
 * MARK: Profile Menu
 * @param {object} param
 * @param {function} param.setIsCardOpen - Function to set the state of the card
 * @param {function} param.onClose - Function to close the card menu (in Desktop view)
 * @returns {JSX.Element} - The user's account details card
 */
const MyAccountCard = ({ setIsCardOpen, onClose }) => {
	const { isAdmin, logout, isOnboarding, userData, isLoggedIn } = useUser();
	const { showRaiseIssueDialog } = useRaiseIssue();
	const isRaiseIssueAllowed = useFeatureFlag("RAISE_ISSUE");

	const { userDetails } = userData;
	const { name, code, email, mobile } = userDetails ?? {};
	const router = useRouter();
	const { copy, state } = useClipboard();
	const menulist = isAdmin ? adminProfileMenu : profileMenu;

	/**
	 * Helper function to close the user-profile menu
	 */
	const close = () => {
		console.log("close::: ", setIsCardOpen ? true : false);
		setIsCardOpen && setIsCardOpen(false);
		onClose && onClose();
	};

	return (
		<Box
			border="card"
			boxShadow="0px 6px 10px #00000033"
			borderRadius="10px"
			w={{ base: "100%", sm: "initial" }}
		>
			{/* PROFILE SECTION */}
			<Flex
				direction="column"
				px={{ base: "3", sm: "2", md: "2", lg: "4" }}
				py={{ base: "2", sm: "2", md: "1", lg: "" }}
				w="full"
				bg="primary.DEFAULT"
				position="relative"
				borderTopRadius="10px"
			>
				{/* Close button for small screen */}
				<Flex
					display={{ base: "flex", sm: "none" }}
					color="white"
					justifyContent="flex-end"
					w="100%"
				>
					<Icon name="close" size="16px" onClick={close} />
				</Flex>
				<Box
					display={{ base: "none", sm: "initial" }}
					color="primary.DEFAULT"
					transform="rotate(180deg)"
					position="absolute"
					top="-12px"
					right="14px"
				>
					<Icon name="arrow-drop-down" size="sm" />
				</Box>

				<Box w="full" py="10px" userSelect="none">
					<Flex
						w="full"
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
						{name ? (
							<Text
								fontSize={{
									base: "16px",
									sm: "12px",
									lg: "14px",
								}}
								color="highlight"
								textTransform="capitalize"
								whiteSpace="nowrap"
								overflow="hidden"
								textOverflow="ellipsis"
								width="40%"
								title={name || ""}
							>
								{name?.toLowerCase()}
							</Text>
						) : null}

						{code && code > 1 ? (
							<Flex
								fontSize={{ base: "xs", sm: "xxs" }}
								align="center"
								w="fit-content"
								color="white"
								gap="1"
							>
								<Text as="span">User Code:</Text>
								<Flex
									align="center"
									gap="0.5"
									cursor="pointer"
									transition="opacity 0.3s ease-out"
									_hover={{ opacity: 0.9 }}
									onClick={() => copy(code)}
								>
									<Text as="span" fontWeight="medium">
										{code}
									</Text>
									<Icon
										title="Copy"
										name={
											state[code]
												? "check"
												: "content-copy"
										}
										size="xs"
										color="white"
										transition="opacity 0.3s ease-out"
									/>
								</Flex>
							</Flex>
						) : null}
					</Flex>

					{email ? (
						<Flex
							py=".3vw"
							align="center"
							gap="0.5"
							cursor="pointer"
							transition="opacity 0.3s ease-out"
							_hover={{ opacity: 0.9 }}
							onClick={() => copy(email)}
						>
							<Text
								fontSize={{
									base: "12px",
									sm: "10px",
								}}
								w="fit-content"
								color="white"
							>
								{email}
							</Text>
							<Icon
								title="Copy"
								name={state[email] ? "check" : "content-copy"}
								color="white"
								size="xs"
							/>
						</Flex>
					) : null}

					{mobile && mobile > 1 ? (
						<Flex
							w="full"
							py="2"
							justify="space-between"
							mt={{ base: "8px", sm: "initial" }}
							wrap="wrap"
						>
							<Flex
								justify="space-between"
								align="center"
								gap={{ base: "4", sm: "2" }}
							>
								<Flex
									align="center"
									gap="0.5"
									cursor="pointer"
									transition="opacity 0.3s ease-out"
									_hover={{ opacity: 0.9 }}
									onClick={() => copy(mobile)}
								>
									<Text
										fontSize={{ base: "xs", sm: "xxs" }}
										color="white"
									>
										+91{" "}
										{mobile.slice(0, 5) +
											" " +
											mobile.slice(5)}
									</Text>
									<Icon
										title="Copy"
										name={
											state[mobile]
												? "check"
												: "content-copy"
										}
										color="white"
										size="xs"
									/>
								</Flex>
								<IcoButton
									size="xs"
									theme="accent"
									iconName="mode-edit"
									onClick={() => {
										const prefix = isAdmin ? "/admin" : "";
										router.push(
											`${prefix}/transaction/${TransactionIds.MANAGE_MY_ACCOUNT}/${TransactionIds.UPDATE_REGISTERED_MOBILE}`
										);
										close();
									}}
								/>
							</Flex>

							{isAdmin !== true && isOnboarding !== true && (
								<Button
									size="xs"
									icon="chevron-right"
									iconPosition="right"
									iconSpacing="2px"
									h="36px"
									fontWeight="semibold"
									borderRadius="6px"
									fontSize="12px"
									onClick={() => {
										close();
										router.push(Endpoints.USER_PROFILE);
									}}
								>
									View Profile
								</Button>
							)}
						</Flex>
					) : null}
				</Box>

				{isOnboarding !== true && isAdmin === true ? (
					<AdminViewToggleCard minimal />
				) : null}
			</Flex>

			{/* MENU SECTION */}
			<Flex
				direction="column"
				px="4"
				w="100%"
				bg="white"
				h={{ base: "100%", sm: "initial" }}
				fontSize={{ base: "sm", md: "xs" }}
				borderBottomRadius="10px"
			>
				{/* Raise-Query menu item */}
				{isLoggedIn && isRaiseIssueAllowed ? (
					<>
						<Flex
							w="100%"
							h={{ base: "auto", md: "100%" }}
							align="center"
							justify="space-between"
							cursor="pointer"
							minH="50px"
							onClick={() => {
								close();
								showRaiseIssueDialog({ origin: "Global-Help" });
							}}
						>
							<Text>Raise Query</Text>
							<Icon name="chevron-right" size="xxs" />
						</Flex>
						<Divider />
					</>
				) : null}

				{/* Configured menu items (internal links) which are configured in `constants/profileCardMenu.js` */}
				{isOnboarding !== true
					? menulist.map((ele) => (
							<Fragment key={"mnu-" + ele.title + ele.link}>
								<Flex
									w="100%"
									h={{ base: "auto", md: "100%" }}
									align="center"
									justify="space-between"
									cursor="pointer"
									minH="50px"
									onClick={() => {
										router.push(ele.link);
										close();
									}}
								>
									<Text>{ele.title}</Text>
									<Icon name="chevron-right" size="xxs" />
								</Flex>
								<Divider />
							</Fragment>
						))
					: null}

				{/* Logout Row */}
				<Flex
					direction="row"
					minH="50px"
					w="100%"
					justify="space-between"
					cursor="pointer"
					align="center"
					color="error"
				>
					<Flex py="3" align="center" onClick={logout}>
						<Icon name="logout" size="sm" mr="2" />
						<Text fontWeight="medium">Logout</Text>
					</Flex>
					<Tooltip label="Clear Cache" placement="left" hasArrow>
						<Flex
							ml="2"
							px="3"
							py="2"
							borderLeft="1px solid"
							borderColor="divider"
							onClick={() => clearCacheAndReload(true)}
							_hover={{ bg: "gray.100" }}
						>
							<Icon
								name="reload"
								label="Clear Cache"
								size="14px"
							/>
						</Flex>
					</Tooltip>
				</Flex>
			</Flex>
		</Box>
	);
};
