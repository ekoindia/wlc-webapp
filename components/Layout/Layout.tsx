import {
	Box,
	chakra,
	Flex,
	Text,
	useBreakpointValue,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
// import { GlobalSearchPane } from "components";
import { ActionIcon } from "components/GlobalSearch";
import { useSession, useTodos } from "contexts";
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
import { useEffect, useMemo } from "react";
// import { Parser } from "utils/mathParser";
import { useClipboard, useDebouncedState, useHotkey, usePlatform } from "hooks";
import { parse } from "utils";
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

	const { isLoggedIn } = useSession();
	const { isOpen, onOpen, onClose } = useDisclosure(); // For controlling the left navigation drawer

	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	const { query } = useKBar();

	// Add additional hotkey (Alt+K) to toggle the KBar
	// with selected text as search input
	useHotkey({
		"Alt+KeyK": (e) => {
			console.log("Alt+K pressed");
			e.preventDefault();
			e.stopPropagation();
			// Get selected text from the screen
			const selectedText = window.getSelection().toString();
			query.toggle();
			if (selectedText) {
				setTimeout(() => {
					query.setSearch(selectedText);
				}, 100);
			}
		},
	});

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
									<Box
										cursor="pointer"
										onClick={() => query.toggle()}
									>
										{isSmallScreen ? (
											<Icon name="close" size="sm" />
										) : (
											<Kbd>Esc</Kbd>
										)}
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

	const [queryValueDebounced, setQueryValueDebounced] = useDebouncedState(
		"",
		100,
		2000
	);

	useEffect(() => {
		setQueryValueDebounced(queryValue);
	}, [queryValue, setQueryValueDebounced]);

	const { addTodo } = useTodos();
	const { copy } = useClipboard();
	const toast = useToast();
	const { isLoggedIn, isAdmin } = useSession();

	const router = useRouter();

	const historySearch = useMemo(() => {
		if (!isLoggedIn) {
			return [];
		}

		const unformattedNumberQuery = queryValueDebounced.replace(
			/[^0-9a-zA-Z]/g,
			""
		);
		const len = unformattedNumberQuery.length;

		const numQueryVal = Number(unformattedNumberQuery);

		// Check if the query is a valid number
		const isValidNumQuery =
			numQueryVal &&
			Number.isFinite(numQueryVal) &&
			len >= 2 &&
			len <= 18;

		const results = [];
		let validQueryFound = false;

		if (isValidNumQuery && !isAdmin) {
			// Show Transaction History Search Actions for Non-Admin users only

			if (len === 10 && /^[6-9]/.test(queryValueDebounced)) {
				// Mobile number
				results.push(
					getKBarAction({
						id: "historySearch/mobile",
						name: "Search Transaction History by Mobile",
						subtitle: `Customer's Mobile = ${queryValueDebounced}`,
						keywords: queryValueDebounced,
						icon: "", // "mobile"
						perform: () =>
							router.push(
								`/history?customer_mobile=${queryValueDebounced}`
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
						subtitle: `Amount = ₹${queryValueDebounced}`,
						keywords: queryValueDebounced,
						icon: "", // "amount"
						// section: "History",
						perform: () =>
							router.push(
								`/history?amount=${queryValueDebounced}`
							),
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
						subtitle: `Transaction ID = ${queryValueDebounced}`,
						keywords: queryValueDebounced,
						icon: "", // "tid"
						// section: "History",
						perform: () =>
							router.push(`/history?tid=${queryValueDebounced}`),
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
						subtitle: `Account Number = ${queryValueDebounced}`,
						keywords: queryValueDebounced,
						icon: "", // "tid"
						// section: "History",
						perform: () =>
							router.push(
								`/history?account=${queryValueDebounced}`
							),
					})
				);
				validQueryFound = true;
			}
		}

		if (!validQueryFound && !isAdmin) {
			// Show Genric Transaction History Search Action for Non-Admin users only
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
		if (queryValueDebounced?.length > 2 && !isAdmin) {
			results.push({
				id: "note/add",
				name: "Save this note as a Quick Reminder",
				subtitle: `Saved notes will appear on your homepage`,
				keywords: queryValueDebounced,
				icon: <ActionIcon icon="book" iconSize="lg" color="#9333ea" />,
				// section: "Tools",
				priority: Priority.LOW,
				perform: () => addTodo(queryValueDebounced),
			});

			// Math parser...
			if (queryValueDebounced.charAt(0) === "=") {
				// const mathParser = new Parser();
				// const result = mathParser.parse(queryValueDebounced.slice(1));
				const result = parse(queryValueDebounced.slice(1));

				if (result) {
					results.push({
						id: "math/parse",
						name: `Result: ${result}`,
						subtitle: `Select to copy result`,
						keywords: queryValueDebounced,
						icon: <ActionIcon name="=" style="filled" />,
						perform: () => {
							result && copy(result.toString());
							toast({
								title: "Copied: " + result,
								status: "success",
								duration: 2000,
							});
						},
					});
				}
			}
		}

		return results;
	}, [queryValueDebounced, router]);

	useRegisterActions(historySearch, [historySearch]);

	// Don't render anything.
	return null;
}

/**
 * Component to render KBar results
 * @param {String} className - The class name to be applied to the rendered results.
 */
function RenderResults({ className }) {
	const { results } = useMatches();
	const { isMac } = usePlatform();

	// console.log("⌘ K Bar results:", results);

	// Chakra wrapper for KBarResults
	const ChakraKBarResults = chakra(KBarResults);

	if (results.length) {
		return (
			<>
				<BackButton />
				<ChakraKBarResults
					items={results}
					maxHeight={500}
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
										display={{
											base: "none",
											md: "inline-flex",
										}}
									>
										{shortcut
											.replace(
												/\$mod/,
												isMac ? "⌘" : "Ctrl"
											)
											.replace(/Alt/, isMac ? "⌥" : "Alt")
											.replace(/Shift/, "⇧")

											.replace(/Enter/, "⏎")
											.replace(/\+/g, " + ")}
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
