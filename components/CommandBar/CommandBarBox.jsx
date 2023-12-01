import {
	Box,
	chakra,
	Flex,
	Text,
	useBreakpointValue,
	useToast,
} from "@chakra-ui/react";
import { useSession, useTodos } from "contexts";
import { useClipboard, useDebouncedState, useHotkey } from "hooks";
import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarResults,
	KBarSearch,
	useKBar,
	useMatches,
} from "kbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	getCalculatorAction,
	getHistorySearchActions,
	getNotesAction,
	ResultItem,
	useKBarReady,
} from ".";
import { Icon, Kbd } from "..";

/**
 * KBar Portal Box to show the search bar and results
 * @param {any} fontClassName - The class name to be applied to the rendered results for setting custom font.
 * @returns
 */
export default function CommandBarBox({ fontClassName }) {
	const { query } = useKBar();

	const isSmallScreen = useBreakpointValue(
		{ base: true, md: false },
		{ ssr: false }
	);

	// Check if CommandBar is loaded...
	const { ready } = useKBarReady();

	// Chakra wrapper for KBar components
	const ChakraKBarPositioner = chakra(KBarPositioner);
	const ChakraKBarAnimator = chakra(KBarAnimator);
	const ChakraKBarPortal = chakra(KBarPortal);
	const ChakraKBarSearch = chakra(KBarSearch);

	// Add additional hotkey (Alt+K) to toggle the KBar
	// with selected text as search input
	useHotkey(
		ready
			? {
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
			  }
			: {}
	);

	if (!ready) {
		return null;
	}

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
					<RenderResults
						className={fontClassName}
						isSmallScreen={isSmallScreen}
					/>
				</ChakraKBarAnimator>
			</ChakraKBarPositioner>
		</ChakraKBarPortal>
	);
}

/**
 * A custom Kbd component to show the keyboard shortcut in the KBar search results
 */
function Key({ children, ...rest }) {
	return (
		<Kbd bg="white" fontFamily="sans" minH="22px" minW="22px" {...rest}>
			{children}
		</Kbd>
	);
}

/**
 * Get dynamic custom result actions based on the query value
 * @param {object} Options
 * @param {string} Options.queryValue - The query value to be used to generate dynamic actions.
 * @param {string} Options.current - The KBar result currentRootActionId.
 * @param {boolean} Options.isAdmin - Whether the current user is an admin or not.
 * @param {object} Options.router - The Next.js router object.
 * @param {function} Options.addTodo - The function to be used to add a new todo.
 * @param {function} Options.copy - The function to be used to copy text to clipboard.
 * @param {function} Options.toast - The function to be used to show a toast notification.
 * @param {function} Options.parse - The function to be used to parse a math expression.
 * @param {function} Options.setParse - The function to be used to load and set the parse function dynamically.
 * @param {string} Options.parseLoadState - The state of the dynamically-loaded parse function.
 * @param {function} Options.setParseLoadState - The function to be used to set the parseLoadState.
 */
const getDynamicActions = ({
	queryValue,
	current,
	isAdmin,
	router,
	addTodo,
	copy,
	toast,
	parse,
	setParse,
	parseLoadState,
	setParseLoadState,
}) => {
	const preActions = [];
	const postActions = [];

	// If it is a sub-page, don't show any dynamic actions
	if (current) {
		return [preActions, postActions];
	}

	if (queryValue.charAt(0) === "=") {
		// Calculator action...
		const expr = queryValue.slice(1);
		preActions.push(
			getCalculatorAction({
				expr,
				copy,
				toast,
				parse,
				setParse,
				parseLoadState,
				setParseLoadState,
			})
		);
	} else {
		// Other actions...

		// Add History Search actions...
		const historyActions = getHistorySearchActions({
			queryValue,
			router,
			isAdmin,
		});
		preActions.push(...historyActions);

		// Add Notes/Todo action...
		if (!isAdmin) {
			postActions.push(...getNotesAction({ queryValue, addTodo, toast }));
		}
	}

	return [preActions, postActions];
};

/**
 * Component to render KBar results
 * @param {String} className - The class name to be applied to the rendered results.
 */
function RenderResults({ className, isSmallScreen }) {
	const { results } = useMatches();
	const { queryValue, current } = useKBar((state) => ({
		current: state.currentRootActionId,
		queryValue: state.searchQuery,
	}));
	const { isLoggedIn, isAdmin } = useSession();
	const { addTodo } = useTodos();
	const router = useRouter();

	const [parse, setParse] = useState(null);
	const [parseLoadState, setParseLoadState] = useState("");

	const { copy } = useClipboard();
	const toast = useToast();

	const [preActions, setPreActions] = useState([]);
	const [postActions, setPostActions] = useState([]);

	const [queryValueDebounced, setQueryValueDebounced] = useDebouncedState(
		"",
		150,
		1000
	);

	useEffect(() => {
		setQueryValueDebounced(queryValue);
	}, [queryValue, setQueryValueDebounced]);

	// console.log("⌘ K Bar results:", current, results);

	useEffect(() => {
		// Add custom dynamic actions based on the query value...
		const [_preActions, _postActions] = getDynamicActions({
			queryValue: queryValueDebounced,
			current,
			isAdmin,
			router,
			addTodo,
			copy,
			toast,
			parse,
			setParse,
			parseLoadState,
			setParseLoadState,
		});
		setPreActions(_preActions);
		setPostActions(_postActions);
	}, [queryValueDebounced, current, isAdmin, router, addTodo, parse]);

	if (!isLoggedIn) {
		return null;
	}

	const customResults = [...preActions, ...results, ...postActions];

	// Chakra wrapper for KBarResults
	const ChakraKBarResults = chakra(KBarResults);

	if (customResults.length) {
		return (
			<>
				<BackButton className={className} />
				<ChakraKBarResults
					items={customResults}
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
							<ResultItem
								className={className}
								item={item}
								active={active}
							/>
						);
					}}
				/>
				{
					/*current || */ isSmallScreen ||
					queryValue?.length ? null : (
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
							<Key>↓</Key>
							&nbsp;select&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<Key>⏎</Key>
							&nbsp;open&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							{current ? (
								<>
									<Key>⌫</Key> &nbsp;back
								</>
							) : (
								<>
									<Key>=</Key>&nbsp;calculator
								</>
							)}
						</Flex>
					)
				}
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
