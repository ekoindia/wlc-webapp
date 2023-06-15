import {
	Box,
	chakra,
	Flex,
	Text,
	useBreakpointValue,
	useToast,
} from "@chakra-ui/react";
import { ActionIcon } from "components/CommandBar";
import { useSession, useTodos } from "contexts";
import { useClipboard, useDebouncedState, useHotkey, usePlatform } from "hooks";
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
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Icon, Kbd } from "..";

/**
 * KBar Portal Box to show the search bar and results
 * @param {any} fontClassName - The class name to be applied to the rendered results for setting custom font.
 * @returns
 */
export default function CommandBarBox({ fontClassName }) {
	const { query } = useKBar();

	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	// Chakra wrapper for KBar components
	const ChakraKBarPositioner = chakra(KBarPositioner);
	const ChakraKBarAnimator = chakra(KBarAnimator);
	const ChakraKBarPortal = chakra(KBarPortal);
	const ChakraKBarSearch = chakra(KBarSearch);

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

	return (
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
						// shadow="md"
						borderTop="2xl"
						pb="4px"
						border="1px solid #f1f5f9"
						bg="#f8fafc"
						borderBottomColor="#cbd5e1"
					>
						<Flex alignItems="center" p="6px 12px">
							<Icon name="search" size="md" color="#475569" />
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
									<Kbd minH="24px">Esc</Kbd>
								)}
							</Box>
						</Flex>
					</Box>
					<DynamicSearchController />
					<RenderResults
						className={fontClassName}
						isSmallScreen={isSmallScreen}
					/>
				</ChakraKBarAnimator>
			</ChakraKBarPositioner>
		</ChakraKBarPortal>
	);
}

function Key({ children, ...rest }) {
	return (
		<Kbd bg="white" fontFamily="sans" minH="22px" minW="22px" {...rest}>
			{children}
		</Kbd>
	);
}

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

	const [parse, setParse] = useState(null);
	const [parseLoadState, setParseLoadState] = useState("");

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

	// Prepare the Command Bar actions for History search, Calculator, Notes, etc.
	const historySearch = useMemo(() => {
		if (!isLoggedIn) {
			return [];
		}

		const results = [];
		const expr = queryValueDebounced.slice(1);

		// Math parser...
		if (queryValueDebounced.charAt(0) === "=") {
			let result;

			// Lazy load the math parser
			if (parseLoadState === "") {
				setParseLoadState("loading");
				import("/utils/exprParser.js")
					.then((exprParser) => {
						// Update context values once exprParser is loaded
						setParse(() => exprParser.parse);
						setParseLoadState("loaded");
					})
					.catch((error) => {
						console.error("Error loading exprParser:", error);
						setParseLoadState("error");
					});
			}

			// Parse the expression if the parser is loaded
			if (expr && parse && parseLoadState === "loaded") {
				result = parse(expr);
			}

			results.push({
				id: "math/parse",
				name: result ? `${result}` : "Calculator",
				subtitle: result
					? `Result of ${queryValueDebounced.slice(1)}  (⏎ to copy)`
					: parseLoadState === "loading"
					? "Loading calculator..."
					: parseLoadState === "error"
					? "Error loading calculator!"
					: expr
					? "Error: Invalid expression!"
					: "Start typing an expression to calculate... (eg: =2+2)",
				keywords: queryValueDebounced,
				icon: (
					<ActionIcon
						icon="calculator"
						style=""
						size="lg"
						color="#7c3aed"
					/>
				),
				perform: () => {
					if (result) {
						copy(result.toString());
						toast({
							title: "Copied: " + result,
							status: "success",
							duration: 2000,
						});
					}
				},
			});
		} else {
			// Not a calculator prompt.
			// Show other actions based on numeric search...

			// Remove formatters (commas and spaces) from the number query
			const unformattedNumberQuery = queryValueDebounced.replace(
				/(?<=[0-9])[ ,]/g,
				""
			);
			const len = unformattedNumberQuery.length;
			const isDecimal = unformattedNumberQuery.includes(".");

			const numQueryVal = Number(unformattedNumberQuery);

			// Check if the query is a valid number
			const isValidNumQuery =
				numQueryVal &&
				queryValueDebounced.charAt(0) !== "=" &&
				Number.isFinite(numQueryVal) &&
				len >= 2 &&
				len <= 18;

			let validQueryFound = false;

			if (isValidNumQuery && !isAdmin) {
				// Show Transaction History Search Actions for Non-Admin users only

				if (
					len === 10 &&
					/^[6-9]/.test(queryValueDebounced) &&
					!isDecimal
				) {
					// Mobile number
					results.push(
						getKBarAction({
							id: "historySearch/mobile",
							name: "Search Transaction History by Mobile",
							subtitle: `Customer's Mobile = ${numQueryVal}`,
							keywords: queryValueDebounced,
							icon: "", // "mobile"
							perform: () =>
								router.push(
									`/history?customer_mobile=${numQueryVal}`
								),
						})
					);
					validQueryFound = true;
				}

				if (len <= 7) {
					// Amount
					results.push(
						getKBarAction({
							id: "historySearch/amount",
							name: "Search Transaction History by Amount",
							subtitle: `Amount = ₹${numQueryVal}`,
							keywords: queryValueDebounced,
							icon: "", // "amount"
							// section: "History",
							perform: () =>
								router.push(`/history?amount=${numQueryVal}`),
						})
					);
					validQueryFound = true;
				}

				if (len === 10 && !isDecimal) {
					// TID
					results.push(
						getKBarAction({
							id: "historySearch/tid",
							name: "Search Transaction History by TID",
							subtitle: `Transaction ID = ${numQueryVal}`,
							keywords: queryValueDebounced,
							icon: "", // "tid"
							// section: "History",
							perform: () =>
								router.push(`/history?tid=${numQueryVal}`),
						})
					);
					validQueryFound = true;
				}

				if (len >= 9 && len <= 18 && !isDecimal) {
					// Account Number
					results.push(
						getKBarAction({
							id: "historySearch/account",
							name: "Search Transaction History by Account Number",
							subtitle: `Account Number = ${numQueryVal}`,
							keywords: queryValueDebounced,
							icon: "", // "tid"
							// section: "History",
							perform: () =>
								router.push(`/history?account=${numQueryVal}`),
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
					icon: (
						<ActionIcon icon="book" iconSize="lg" color="#9333ea" />
					),
					// section: "Tools",
					priority: Priority.LOW,
					perform: () => addTodo(queryValueDebounced),
				});
			}
		}

		return results;
	}, [queryValueDebounced, router, parse, parseLoadState]);

	useRegisterActions(historySearch, [historySearch]);

	// Don't render anything.
	return null;
}

/**
 * Component to render KBar results
 * @param {String} className - The class name to be applied to the rendered results.
 */
function RenderResults({ className, isSmallScreen }) {
	const { results } = useMatches();
	const { isMac } = usePlatform();
	const { queryValue, current } = useKBar((state) => ({
		current: state.currentRootActionId,
		queryValue: state.searchQuery,
	}));

	// console.log("⌘ K Bar results:", current);

	// Chakra wrapper for KBarResults
	const ChakraKBarResults = chakra(KBarResults);

	if (results.length) {
		return (
			<>
				<BackButton className={className} />
				<ChakraKBarResults
					items={results}
					// maxHeight={500}
					onRender={({ item, active }) => {
						if (typeof item === "string") {
							// Render a section header
							return (
								<Text
									key={"section" + item.id}
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
								key={"itm" + item.id}
								className={className}
								alignItems="center"
								cursor="pointer"
								gap="3px"
								// mx="4px"
								p="8px 15px"
								minH="62px"
								// borderRadius="md"
								borderLeft="4px solid"
								borderLeftColor={
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
								{item?.shortcut?.map((shortcut, index) => {
									const keys = shortcut.split("+");
									return (
										<Fragment key={"sk" + shortcut + index}>
											{index > 0 ? (
												<Text
													fontFamily="mono"
													color="gray.500"
													mx={1}
												>
													→
												</Text>
											) : null}
											{keys.map((key, i2) => (
												<Kbd
													key={key + index + i2}
													minH="24px"
													minW="24px"
													variant="dark"
													fontFamily={
														key === "$mod"
															? "sans"
															: null
													}
													textTransform={
														key?.length === 1
															? "uppercase"
															: undefined
													}
													display={{
														base: "none",
														md: "inline-flex",
													}}
												>
													{
														key
															.replace(
																/\$mod/,
																isMac
																	? "⌘"
																	: "Ctrl"
															)
															.replace(
																/Alt/,
																isMac
																	? "⌥"
																	: "Alt"
															)
															.replace(
																/Shift/,
																"⇧"
															)
															.replace(
																/Enter/,
																"⏎"
															)
														// .replace(/\+/g, " + ")
													}
												</Kbd>
											))}
										</Fragment>
									);
								})}
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
				{current || isSmallScreen || queryValue?.length ? null : (
					<Flex
						className={className}
						h="42px"
						p="4px 8px"
						bg="#e2e8f0"
						align="center"
						borderTop="1px solid #cbd5e1"
						fontSize="0.9em"
						color="#64748b"
					>
						<Key>↑</Key>&nbsp;
						<Key>↓</Key>&nbsp;select&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Key>⏎</Key>
						&nbsp;open&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Key>=</Key>&nbsp;calculator
					</Flex>
				)}
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
function BackButton({ className }) {
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
			className={className}
			fontSize="0.9em"
			align="center"
			p="6px 12px"
			cursor="pointer"
			borderBottom="1px solid #f1f5f9"
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
