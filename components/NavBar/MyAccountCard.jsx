import { Box, Divider, Flex, Text, Tooltip } from "@chakra-ui/react";
import { TransactionIds } from "constants";
import { adminProfileMenu, profileMenu } from "constants/profileCardMenus";
import { useOrgDetailContext, useUser } from "contexts";
import { getChatGptAgentUrl } from "helpers";
import { useClipboard, useFeatureFlag, useRaiseIssue } from "hooks";
import { useRouter } from "next/router";
import { clearCacheAndReload } from "utils";
import { AdminViewToggleCard, IcoButton, Icon } from "..";

/**
 * Reusable menu item component for profile card menu
 * MARK: MenuItem
 * @param {object} props - Component props
 * @param {string} props.title - Menu item title to display
 * @param {string} props.iconName - Icon name from the IconLibrary
 * @param {string} props.iconColor - Chakra UI color token or CSS color for the icon
 * @param {string} props.bgColor - Chakra UI color token or CSS color for icon background
 * @param {() => void} props.onClick - Click handler function
 * @param {boolean} [props.isExternal] - Whether the link opens externally (shows different arrow icon)
 * @returns {JSX.Element} - Rendered menu item component
 */
const MenuItem = ({
	title,
	iconName,
	iconColor,
	bgColor,
	onClick,
	isExternal = false,
}) => (
	<Flex
		w="100%"
		align="center"
		justify="space-between"
		cursor="pointer"
		px="4"
		py="3"
		borderRadius="12px"
		transition="all 0.2s ease"
		_hover={{
			bg: "gray.50",
			transform: "translateX(4px)",
		}}
		onClick={onClick}
	>
		<Flex align="center" gap="3">
			<Flex
				w="36px"
				h="36px"
				align="center"
				justify="center"
				bg={bgColor}
				borderRadius="10px"
			>
				<Icon name={iconName} size="18px" color={iconColor} />
			</Flex>
			<Text fontWeight="medium" color="gray.700">
				{title}
			</Text>
		</Flex>
		<Icon
			name={isExternal ? "open-in-new" : "chevron-right"}
			size="16px"
			color="gray.400"
		/>
	</Flex>
);

/**
 * Contact information item with copy functionality for email, phone, etc.
 * MARK: ContactItem
 * @param {object} props - Component props
 * @param {string} props.iconName - Icon name from the IconLibrary (e.g., 'mail', 'phone')
 * @param {string} props.value - Contact value to display (email address, phone number, etc.)
 * @param {() => void} props.onCopy - Function to handle copy action
 * @param {boolean} props.isCopied - Whether the value was recently copied (shows check icon)
 * @param {React.ReactNode} [props.actionButton] - Optional action button component (e.g., edit button)
 * @returns {JSX.Element} - Rendered contact item component
 */
const ContactItem = ({ iconName, value, onCopy, isCopied, actionButton }) => (
	<Flex
		align="center"
		gap="2"
		cursor="pointer"
		transition="all 0.2s ease"
		_hover={{ transform: "translateY(-2px)" }}
		onClick={onCopy}
	>
		<Icon name={iconName} size="14px" color="rgba(255, 255, 255, 0.8)" />
		<Text fontSize="13px" color="rgba(255, 255, 255, 0.9)">
			{value}
		</Text>
		<Icon
			name={isCopied ? "check" : "content-copy"}
			color="rgba(255, 255, 255, 0.7)"
			size="12px"
		/>
		<Box flex="1"></Box>
		{actionButton}
	</Flex>
);

/**
 * Logout section component with logout action and clear cache functionality
 * MARK: LogoutSection
 * @param {object} props - Component props
 * @param {() => void} props.onLogout - Logout handler function
 * @param {() => void} props.onClearCache - Clear cache and reload handler function
 * @returns {JSX.Element} - Rendered logout section component
 */
const LogoutSection = ({ onLogout, onClearCache }) => (
	<Flex
		w="100%"
		align="center"
		justify="space-between"
		cursor="pointer"
		px="4"
		py="3"
		borderRadius="12px"
		transition="all 0.2s ease"
		_hover={{
			bg: "red.50",
		}}
	>
		<Flex align="center" gap="3" onClick={onLogout} flex="1">
			<Flex
				w="36px"
				h="36px"
				align="center"
				justify="center"
				bg="red.50"
				borderRadius="10px"
			>
				<Icon name="logout" size="18px" color="error" />
			</Flex>
			<Text fontWeight="medium" color="error">
				Logout
			</Text>
		</Flex>
		<Tooltip label="Clear Cache & Reload" placement="left" hasArrow>
			<Flex
				w="36px"
				h="36px"
				align="center"
				justify="center"
				bg="gray.100"
				borderRadius="10px"
				transition="all 0.2s ease"
				_hover={{
					bg: "gray.200",
					transform: "scale(1.05)",
				}}
				onClick={onClearCache}
			>
				<Icon name="reload" size="16px" color="gray.600" />
			</Flex>
		</Tooltip>
	</Flex>
);

/**
 * The Top-Right Profile Menu Card Component. It is triggered by the user clicking on the profile icon in the top-right of the screen (in Desktop view), and shows the following details:
 * - User's Profile Card: name, email, mobile, user code
 * - Menu items: Raise Query, View Profile, and other configured menu items
 * - Option to reload the webapp after clearing cache.
 * - Logout option
 * MARK: Profile Menu
 * @param {object} param
 * @param {Function} param.onClose - Function to close the card menu (in Desktop view)
 * @returns {JSX.Element} - The user's account details card
 */
const MyAccountCard = ({ onClose }) => {
	const {
		isAdmin,
		logout,
		isOnboarding,
		UserTypeLabel,
		userData,
		isLoggedIn,
	} = useUser();
	const { showRaiseIssueDialog } = useRaiseIssue();
	const [isRaiseIssueAllowed] = useFeatureFlag("RAISE_ISSUE");
	const [isRaiseIssueAllowedForSbiKiosk] = useFeatureFlag(
		"RAISE_ISSUE_SBIKIOSK"
	);
	const [isChatGptAgentAllowed] = useFeatureFlag("CHATGPT_AGENT_LINK");
	const { orgDetail } = useOrgDetailContext();

	const { userDetails } = userData;
	const { name, code, email, mobile } = userDetails ?? {};
	const router = useRouter();
	const { copy, state } = useClipboard();
	const menulist = isAdmin ? adminProfileMenu : profileMenu;

	const gptAgentUrl = isChatGptAgentAllowed
		? getChatGptAgentUrl({
				orgId: orgDetail?.org_id,
				isAdmin,
			})
		: null;

	/**
	 * Helper function to close the user-profile menu
	 */
	const close = () => {
		onClose && onClose();
	};

	// MARK: Copilot
	// Add Copilot action to open the profile page
	// useCopilotAction({
	// 	name: "open-profile-page",
	// 	description: "Open the user's profile page.",
	// 	handler: async () =>
	// 		router.push((isAdmin ? "/admin" : "") + Endpoints.USER_PROFILE),
	// });

	// MARK: JSX
	return (
		<Box
			position="relative"
			maxH={{ base: "100vh", md: "none" }}
			overflow="visible"
		>
			{/* Decorative triangle arrow */}
			<Box
				position="absolute"
				top="-8px"
				right="20px"
				w="0"
				h="0"
				borderLeft="8px solid transparent"
				borderRight="8px solid transparent"
				borderBottom="8px solid #1F3ABC"
				zIndex="999"
			/>

			<Box
				border="none"
				boxShadow="0px 10px 40px rgba(0, 0, 0, 0.15)"
				borderRadius="20px"
				overflow="hidden"
				bg="white"
				minW={{ base: "280px", md: "320px" }}
				maxW={{ base: "95vw", md: "380px" }}
				maxH={{ base: "90vh", md: "none" }}
				display="flex"
				flexDirection="column"
			>
				{/* MARK: PROFILE SECTION */}
				<Flex
					direction="column"
					// px="6"
					// pt="6"
					w="full"
					bg="linear-gradient(135deg, #1F3ABC 0%, #11299E 100%)"
					position="relative"
					borderRadius="20px 20px 0 0"
				>
					{/* Decorative background pattern */}
					<Box
						position="absolute"
						top="0"
						right="0"
						w="100px"
						h="100px"
						opacity="0.1"
						background="radial-gradient(circle, white 2px, transparent 2px)"
						backgroundSize="20px 20px"
						zIndex="99"
					/>

					<Box
						w="full"
						userSelect="none"
						position="relative"
						zIndex="1"
					>
						{/* MARK: Avatar and Name Row */}
						<Flex
							align="center"
							gap="4"
							p={{ base: "0.8em", md: "1em" }}
							// mb="6"
							position="relative"
							zIndex="2"
							// For Dual-tone overlay:
							bg="rgba(0, 0, 0, 0.15)"
							backdropFilter="blur(10px)"
						>
							{/* Avatar */}
							<Flex
								align="center"
								justify="center"
								w={{ base: "50px", md: "60px" }}
								h={{ base: "50px", md: "60px" }}
								bg="rgba(255, 255, 255, 0.25)"
								borderRadius="full"
								backdropFilter="blur(15px)"
								border="3px solid rgba(255, 255, 255, 0.4)"
								boxShadow="0 8px 20px rgba(0, 0, 0, 0.15)"
								flexShrink="0"
							>
								<Text
									fontSize={{ base: "20px", md: "24px" }}
									fontWeight="bold"
									color="white"
									textTransform="uppercase"
									textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
								>
									{name?.charAt(0) || "U"}
								</Text>
							</Flex>

							{/* Name and User Code Column */}
							<Flex direction="column" gap="2" flex="1" minW="0">
								{name ? (
									<Text
										fontSize={{ base: "16px", md: "18px" }}
										color="white"
										fontWeight="bold"
										textTransform="capitalize"
										whiteSpace="nowrap"
										overflow="hidden"
										textOverflow="ellipsis"
										title={name || ""}
										textShadow="0 2px 8px rgba(0, 0, 0, 0.4)"
										letterSpacing="0.5px"
										lineHeight="1.2"
									>
										{name?.toLowerCase()}
									</Text>
								) : null}

								{UserTypeLabel ? (
									<Text
										fontSize="12px"
										color="rgba(255, 255, 255, 0.8)"
										fontWeight="medium"
										textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
										whiteSpace="nowrap"
										overflow="hidden"
										textOverflow="ellipsis"
										title={UserTypeLabel || ""}
										letterSpacing="0.5px"
										lineHeight="1.2"
									>
										{UserTypeLabel}
									</Text>
								) : null}

								{code && code > 1 ? (
									<Flex
										align="center"
										gap="2"
										bg="rgba(255, 255, 255, 0.2)"
										px="3"
										py="1.5"
										borderRadius="full"
										cursor="pointer"
										transition="all 0.2s ease"
										border="1px solid rgba(255, 255, 255, 0.2)"
										backdropFilter="blur(10px)"
										boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
										w="fit-content"
										_hover={{
											bg: "rgba(255, 255, 255, 0.3)",
											transform: "translateY(-2px)",
											boxShadow:
												"0 6px 16px rgba(0, 0, 0, 0.25)",
										}}
										onClick={() => copy(code)}
									>
										<Text
											fontSize="11px"
											color="rgba(255, 255, 255, 0.95)"
											fontWeight="semibold"
											textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
										>
											ID: {code}
										</Text>
										<Icon
											name={
												state[code]
													? "check"
													: "content-copy"
											}
											size="12px"
											color="rgba(255, 255, 255, 0.95)"
											filter="drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))"
										/>
									</Flex>
								) : null}
							</Flex>
						</Flex>

						{/* Contact Information - Below dual-tone overlay */}
						<Flex
							direction="column"
							gap="3"
							position="relative"
							zIndex="1"
							p={{ base: "0.5em 1em", md: "0.6em 1.5em" }}
						>
							{mobile && mobile > 1 ? (
								<ContactItem
									iconName="phone"
									value={`+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`}
									onCopy={() => copy(mobile)}
									isCopied={state[mobile]}
									actionButton={
										<IcoButton
											size="xs"
											theme="accent"
											iconName="mode-edit"
											onClick={(e) => {
												e.stopPropagation();
												const prefix = isAdmin
													? "/admin"
													: "";
												router.push(
													`${prefix}/transaction/${TransactionIds.MANAGE_MY_ACCOUNT}/${TransactionIds.UPDATE_REGISTERED_MOBILE}`
												);
												close();
											}}
										/>
									}
								/>
							) : null}

							{email ? (
								<ContactItem
									iconName="mail"
									value={email}
									onCopy={() => copy(email)}
									isCopied={state[email]}
								/>
							) : null}

							{/* Organization Name - Only for Admin */}
							{isAdmin && orgDetail?.org_name ? (
								<ContactItem
									iconName="domain"
									value={orgDetail.org_name}
									onCopy={() => copy(orgDetail.org_name)}
									isCopied={state[orgDetail.org_name]}
								/>
							) : null}
						</Flex>

						{/* View Profile Button - Below dual-tone overlay */}
						{/* {isAdmin !== true && isOnboarding !== true && (
							<Box
								p={{ base: "0.5em 1em", md: "0.6em 1.5em" }}
								borderTop="2px solid rgba(0, 0, 0 , 0.1)"
								position="relative"
								zIndex="1"
							>
								<Button
									size="sm"
									variant="outline"
									colorScheme="whiteAlpha"
									color="white"
									borderColor="rgba(255, 255, 255, 0.4)"
									_hover={{
										bg: "rgba(255, 255, 255, 0.15)",
										borderColor: "rgba(255, 255, 255, 0.6)",
										transform: "translateX(4px)",
										boxShadow:
											"0 6px 16px rgba(0, 0, 0, 0.2)",
									}}
									rightIcon={
										<Icon
											name="chevron-right"
											size="14px"
										/>
									}
									borderRadius="12px"
									h="44px"
									fontWeight="medium"
									fontSize="14px"
									onClick={() => {
										close();
										router.push(Endpoints.USER_PROFILE);
									}}
									backdropFilter="blur(8px)"
									boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
								>
									View My Profile
								</Button>
							</Box>
						)} */}
					</Box>

					{/* Admin Toggle Section */}
					{isOnboarding !== true && isAdmin === true && (
						<Box mt="2">
							<AdminViewToggleCard
								minimal
								px={{ base: "1em", md: "1.5em" }}
							/>
						</Box>
					)}
				</Flex>

				{/* MARK: MENU SECTION */}
				<Flex
					direction="column"
					p="2"
					w="100%"
					bg="white"
					fontSize="14px"
					gap="1"
					flex="1"
					overflow={{ base: "auto", md: "visible" }}
					maxH={{ base: "40vh", md: "none" }}
				>
					{/* Raise Query Menu Item */}
					{isLoggedIn &&
						(isRaiseIssueAllowed ||
							isRaiseIssueAllowedForSbiKiosk) && (
							<MenuItem
								title="Raise Query"
								iconName="help-outline"
								iconColor="primary.DEFAULT"
								bgColor="blue.50"
								onClick={() => {
									close();
									showRaiseIssueDialog({
										origin: "Global-Help",
									});
								}}
							/>
						)}

					{/* Dynamic Menu Items */}
					{isOnboarding !== true &&
						menulist
							.filter((ele) => {
								if (ele["trxn-id"]) {
									return (
										userData.role_tx_list[
											ele["trxn-id"]
										] !== undefined
									);
								}
								return true;
							})
							.map((ele, index) => (
								<MenuItem
									key={"mnu-" + ele.title + ele.link}
									title={ele.title}
									iconName={ele.icon || "arrow-forward"}
									iconColor={
										index % 2 === 0
											? "accent.DEFAULT"
											: "purple.500"
									}
									bgColor={
										index % 2 === 0
											? "orange.50"
											: "purple.50"
									}
									onClick={() => {
										router.push(ele.link);
										close();
									}}
								/>
							))}

					{/* ChatGPT Agent Menu Item */}
					{gptAgentUrl && (
						<MenuItem
							title="Ask ChatGPT"
							iconName="chat-outline"
							iconColor="green.500"
							bgColor="green.50"
							isExternal={true}
							onClick={() => {
								close();
								window.open(gptAgentUrl, "_blank");
							}}
						/>
					)}

					{/* Divider */}
					<Divider my="1" />

					{/* MARK: Logout Section */}
					<LogoutSection
						onLogout={() => logout({ isForced: true })}
						onClearCache={() => clearCacheAndReload(true)}
					/>
				</Flex>
			</Box>
		</Box>
	);
};

export default MyAccountCard;
