import {
	Avatar,
	Box,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuList,
	Text,
	useBreakpointValue,
	useDisclosure,
	useToken,
} from "@chakra-ui/react";
import { useKBarReady } from "components/CommandBar";
import { useNotification, useOrgDetailContext, useUser } from "contexts";
import dynamic from "next/dynamic";
import { limitText } from "utils";
import { svgBgDotted } from "utils/svgPatterns";
import { MyAccountCard } from ".";
import { Icon, OrgLogo } from "..";

export const NavHeight = {
	base: "56px",
	md: "50px",
	lg: "60px",
	"2xl": "90px",
};

/**
 * The top app-bar component
 * @param root0
 * @param root0.openSidebar
 */
const NavBar = ({ openSidebar }) => {
	return (
		<>
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
					<NavContent {...{ openSidebar }} />
				</Box>
			</Box>
		</>
	);
};

export default NavBar;

const NavContent = ({ openSidebar }) => {
	const { userData, isAdmin, isAdminAgentMode, isOnboarding, isLoggedIn } =
		useUser();
	const { userDetails } = userData;
	const { name, pic } = userDetails ?? {};
	const { orgDetail } = useOrgDetailContext();
	// const router = useRouter();
	const {
		notificationCount,
		unreadNotificationCount,
		openNotificationPanel,
	} = useNotification();

	const screenSize = useBreakpointValue(
		{ base: "sm", md: "md", lg: "lg" },
		{ ssr: false }
	);

	const isSmallScreen = screenSize === "sm";
	const isTabScreen = screenSize === "md";

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
			<Flex align="center" flexGrow={isSmallScreen ? 1 : 0}>
				{isOnboarding ? null : isTabScreen ? (
					<Icon
						name="menu"
						mr="12px"
						onClick={() => openSidebar()}
						aria-label="open menu"
					/>
				) : null}

				<OrgLogo
					size="md"
					align="center"
					dark={orgDetail?.metadata?.theme?.navstyle === "light"}
					minW={{ base: "auto", md: "250px" }}
				/>

				{!isSmallScreen &&
					ready &&
					isLoggedIn === true &&
					isOnboarding !== true && (
						<Flex justify="flex-start">
							<GlobalSearch />
						</Flex>
					)}
			</Flex>
			{/* Right-side items of navbar */}
			<Flex align="center" gap={{ base: "1em", md: "1.5em" }}>
				{/* Show Notifications Icon, only if notifications are available */}
				{notificationCount ? (
					<Ico
						iconName={
							unreadNotificationCount
								? "notifications"
								: "notifications-none"
						}
						bubble={unreadNotificationCount || ""}
						navstyle={orgDetail?.metadata?.theme?.navstyle}
						onClick={openNotificationPanel}
					/>
				) : null}

				{/* Profile Menu */}
				<Menu defaultIsOpen={false} isOpen={isOpen} onClose={onClose}>
					<MenuButton
						onClick={() => {
							onOpen();
						}}
					>
						<Flex align="center" cursor="pointer" zIndex="10">
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
							base: "320px",
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
					>
						<MyAccountCard {...{ onClose }} />
					</MenuList>
				</Menu>
			</Flex>
		</HStack>
	);
};

/**
 * Icon button to show in the top app bar.
 * @param {*} props
 * @param {string} props.iconName Name of the icon to pass to the Icon component
 * @param {number} props.bubble Number to show in the bubble
 * @param {string} props.navstyle Color style of the navbar: default or light. When "light", the top navbar is actually colored dark.
 * @param {Function} props.onClick Click event handler
 */
const Ico = ({ iconName, bubble, navstyle, onClick }) => {
	return (
		<Flex
			align="center"
			justify="center"
			cursor="pointer"
			onClick={onClick}
			position="relative"
			borderRadius="50%"
			_hover={{ bg: "gray.200" }}
			w="40px"
			h="40px"
		>
			<Icon
				name={iconName}
				size="md"
				color={navstyle === "light" ? "#fff" : "#444"}
			/>

			{bubble ? (
				<Flex
					position="absolute"
					top="1px"
					right="1px"
					bg="#be123c"
					color="white"
					fontSize="xxs"
					fontWeight="semibold"
					borderRadius="50%"
					w="18px"
					h="18px"
					display="flex"
					align="center"
					justify="center"
				>
					{bubble}
				</Flex>
			) : null}
		</Flex>
	);
};
