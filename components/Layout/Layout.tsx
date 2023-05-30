import {
	Box,
	chakra,
	Flex,
	Text,
	useBreakpointValue,
	useDisclosure,
} from "@chakra-ui/react";
// import { GlobalSearchPane } from "components";
import { ActionIcon } from "components/GlobalSearch";
import { useNote, useSession } from "contexts";
import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarResults,
	KBarSearch,
	Priority,
	useKBar,
	useMatches,
	useRegisterActions,
} from "kbar";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Icon, Kbd, NavBar, SideBar } from "..";

/**
 * The default page layout component
 * @param {String} appName - The name of the application. This will be displayed in the browser titlebar.
 * @param {Object} pageMeta - The page meta data.
 * @param {Boolean} pageMeta.isSubPage - If the page is a sub page, then the layout will not render the top navbar (Header) on small screens.
 * @param {String} pageMeta.title - The page title. This will be displayed in the browser titlebar.
 */
const Layout = ({ appName, pageMeta, fontClassName, children }) => {
	const { isSubPage, title, hideMenu } = pageMeta;

	// const { isNavHidden } = useLayoutContext();
	const { isLoggedIn } = useSession();
	const { isOpen, onOpen, onClose } = useDisclosure(); // For controlling the left navigation drawer

	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	// Chakra wrapper for KBar components
	const ChakraKBarPositioner = chakra(KBarPositioner);
	const ChakraKBarAnimator = chakra(KBarAnimator);
	const ChakraKBarPortal = chakra(KBarPortal);
	const ChakraKBarSearch = chakra(KBarSearch);

	return (
		<>
			{title ? (
				<Head>
					<title>
						{title}
						{appName ? ` | ${appName}` : ""}
					</title>
				</Head>
			) : null}

			{isLoggedIn ? (
				<Box w={"full"} className={fontClassName}>
					{/* Hide top navbar on small screen if this is a sub-page (shows it's own back button in the top header) */}
					{isSmallScreen && isSubPage ? null : (
						<Box
							sx={{
								"@media print": {
									display: "none",
								},
							}}
						>
							<NavBar setNavOpen={onOpen} />
						</Box>
					)}

					{hideMenu ? (
						<>{children}</>
					) : (
						<Flex>
							<SideBar navOpen={isOpen} setNavClose={onClose} />

							{/* Main Content here */}

							<Box
								minH={{
									base: "calc(100vh - 56px)",
									md: "calc(100vh - 50px)",
									lg: "calc(100vh - 60px)",
									"2xl": "calc(100vh - 90px)",
								}}
								w={"full"}
								bg={"bg"}
								overflow={"hidden"}
							>
								{children}
							</Box>
						</Flex>
					)}
				</Box>
			) : (
				<>{children}</>
			)}

			{/* <GlobalSearchPane /> */}
			{isLoggedIn ? (
				<ChakraKBarPortal>
					<ChakraKBarPositioner
						className="customScrollbars"
						w="full"
						zIndex={99999}
						p="2em"
						bg="blackAlpha.600"
						backdropFilter="auto"
						backdropBlur="2px"
					>
						<ChakraKBarAnimator
							w="full"
							// bg="#1e293b"
							bg="white"
							p="0"
							borderRadius={6}
							overflow="hidden"
							maxW={{ base: "full", md: "2xl" }}
						>
							<Box
								className={fontClassName}
								overflow="hidden"
								shadow="md"
								borderTop="2xl"
								pb="4px"
								border="1px solid #f1f5f9"
								bg="#f8fafc"
								borderBottom="1px solid #f1f5f9"
							>
								<Flex alignItems="center" p="6px 12px">
									<Icon
										name="search"
										size="md"
										color="#475569"
									/>
									<ChakraKBarSearch
										// defaultPlaceholder="Search anything..."
										w="full"
										h="40px"
										bg="transparent"
										_focus={{ outline: "none" }}
										py="5px"
										ml="1em"
										fontSize={{
											base: "md",
											md: "lg",
											lg: "xl",
										}}
										_placeholder={{
											color: "#94a3b8",
											fontSize: { base: "sm", md: "md" },
										}}
									/>
									<Box>
										<Kbd>Esc</Kbd>
									</Box>
								</Flex>
							</Box>
							<DynamicSearchController />
							<RenderResults className={fontClassName} />
						</ChakraKBarAnimator>
					</ChakraKBarPositioner>
				</ChakraKBarPortal>
			) : null}
		</>
	);
};

export default Layout;

/**
 * Returns a KBar action object
 */
function getKBarAction({
	id,
	name,
	subtitle,
	icon,
	keywords,
	priority = Priority.HIGH,
	perform,
}) {
	return {
		id: id,
		name: name,
		subtitle: subtitle,
		keywords: keywords,
		icon: (
			<ActionIcon
				icon={icon || "transaction-history"}
				iconSize="md"
				color="#334155"
			/>
		),
		priority: priority,
		// section: "History",
		perform: perform,
	};
}

/**
 * Helper component to dynamically update the search results based on the query value.
 */
function DynamicSearchController() {
	const { queryValue } = useKBar((state) => ({
		queryValue: state.searchQuery,
	}));

	const { /* note, */ setNote } = useNote();

	const router = useRouter();

	const historySearch = useMemo(() => {
		const len = queryValue.length;

		const numQueryVal = Number(queryValue);

		// Check if the query is a valid number
		const isValidNumQuery =
			numQueryVal &&
			Number.isFinite(numQueryVal) &&
			len >= 2 &&
			len <= 18;

		const results = [];
		let validQueryFound = false;

		if (isValidNumQuery) {
			if (len === 10 && /^[6-9]/.test(queryValue)) {
				// Mobile number
				results.push(
					getKBarAction({
						id: "historySearch/mobile",
						name: "Search Transaction History by Mobile",
						subtitle: `Customer's Mobile = ${queryValue}`,
						keywords: queryValue,
						icon: "", // "mobile"
						perform: () =>
							router.push(
								`/history?customer_mobile=${queryValue}`
							),
					})
				);
				validQueryFound = true;
			}

			if (len <= 5) {
				// Amount
				results.push(
					getKBarAction({
						id: "historySearch/amount",
						name: "Search Transaction History by Amount",
						subtitle: `Amount = ₹${queryValue}`,
						keywords: queryValue,
						icon: "", // "amount"
						// section: "History",
						perform: () =>
							router.push(`/history?amount=${queryValue}`),
					})
				);
				validQueryFound = true;
			}

			if (len === 10) {
				// TID
				results.push(
					getKBarAction({
						id: "historySearch/tid",
						name: "Search Transaction History by TID",
						subtitle: `Transaction ID = ${queryValue}`,
						keywords: queryValue,
						icon: "", // "tid"
						// section: "History",
						perform: () =>
							router.push(`/history?tid=${queryValue}`),
					})
				);
				validQueryFound = true;
			}

			if (len >= 9 && len <= 18) {
				// Account Number
				results.push(
					getKBarAction({
						id: "historySearch/account",
						name: "Search Transaction History by Account Number",
						subtitle: `Account Number = ${queryValue}`,
						keywords: queryValue,
						icon: "", // "tid"
						// section: "History",
						perform: () =>
							router.push(`/history?account=${queryValue}`),
					})
				);
				validQueryFound = true;
			}
		}

		if (!validQueryFound) {
			results.push(
				getKBarAction({
					id: "historySearch",
					name: "View Transaction History",
					subtitle:
						"Start typing TID, mobile, amount, etc., to search in History...",
					keywords: "",
					icon: "", // "tid"
					// section: "History",
					perform: () => router.push("/history"),
				})
			);
		}

		// Add notes action
		if (queryValue?.length > 2) {
			results.push({
				id: "note/add",
				name: "Save this as a Quick Note",
				subtitle: `Note will be saved to your home page`,
				keywords: queryValue,
				icon: <ActionIcon icon="book" iconSize="md" color="#334155" />,
				section: "Tools",
				priority: Priority.LOW,
				perform: () => setNote(queryValue),
			});
		}

		return results;
	}, [queryValue, router]);

	useRegisterActions(historySearch, [historySearch]);

	// Don't render anything.
	return null;
}

/**
 * Component to render KBar results
 */
function RenderResults({ className }) {
	const { results } = useMatches();

	// console.log("⌘ K Bar results:", results);

	// Chakra wrapper for KBarResults
	const ChakraKBarResults = chakra(KBarResults);

	if (results.length) {
		return (
			<>
				<BackButton />
				<ChakraKBarResults
					items={results}
					onRender={({ item, active }) => {
						if (typeof item === "string") {
							// Render a section header
							return (
								<Text
									className={className}
									textTransform="uppercase"
									fontSize="xs"
									letterSpacing="2px"
									px="4px"
									pt="6px"
									pb="2px"
									color="#64748b"
								>
									{item}
								</Text>
							);
						}

						// Render a search result
						return (
							<Flex
								className={className}
								alignItems="center"
								cursor="pointer"
								gap="3px"
								// mx="4px"
								p="8px 15px"
								minH="62px"
								// borderRadius="md"
								borderLeft="4px solid"
								borderColor={
									active ? "primary.dark" : "transparent"
								}
								bg={active ? "divider" : null}
							>
								{item.icon && (
									<Box
										fontSize="lg"
										// color={active ? "#0f172a" : "#334155"}
										mr="15px"
									>
										{item.icon}
									</Box>
								)}
								<Box overflow="hidden" flexGrow={1}>
									<Text
										noOfLines={2}
										color={active ? "#0f172a" : "#334155"}
										fontWeight="450"
									>
										{item.name}
									</Text>
									{item.subtitle && (
										<Text
											fontSize="xs"
											isTruncated={true}
											color={
												active ? "#475569" : "#64748b"
											}
										>
											{item.subtitle}
										</Text>
									)}
								</Box>
								{item?.shortcut?.map((shortcut, index) => (
									<Kbd
										key={shortcut + index}
										variant="dark"
										textTransform={
											shortcut?.length === 1
												? "uppercase"
												: undefined
										}
									>
										{shortcut.replace(/\$mod\+/, "⌘ ")}
									</Kbd>
								))}
								{item.children?.length > 0 && (
									<Icon
										name="chevron-right"
										size="sm"
										color="#64748b"
										ml={{ base: 0, md: 2 }}
									/>
								)}
							</Flex>
						);
					}}
				/>
			</>
		);
	} else {
		return (
			<Text px="4" py="6" textAlign="center" color="#475569">
				Nothing found...
			</Text>
		);
	}
}

/**
 * Back button for the search results
 */
function BackButton() {
	const { query, current, parentId, parentName } = useKBar((state) => ({
		current: state.currentRootActionId,
		parentId: state.actions[state.currentRootActionId]?.parent,
		parentName: state.actions[state.currentRootActionId]?.name,
	}));

	if (!(parentId || current)) {
		return null;
	}

	return (
		<Flex
			align="center"
			p={2}
			cursor="pointer"
			_hover={{ bg: "#e2e8f0" }}
			color="#64748b"
			onClick={() => query.setCurrentRootAction(parentId)}
		>
			<Icon name="arrow-back" size="xs" />
			<Text ml={3} size="sm" fontWeight="450">
				{parentName || "Back"}
			</Text>
		</Flex>
	);
}
