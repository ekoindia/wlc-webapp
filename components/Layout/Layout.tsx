import {
	Box,
	chakra,
	Flex,
	Text,
	useBreakpointValue,
	useDisclosure,
} from "@chakra-ui/react";
// import { GlobalSearchPane } from "components";
import { useSession } from "contexts";
import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarResults,
	KBarSearch,
	useMatches,
} from "kbar";
import Head from "next/head";
import { Icon, NavBar, SideBar } from "..";

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
						w="full"
						zIndex={99999}
						p="2em"
						bg="blackAlpha.500"
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
								shadow="2xl"
								borderRadius="2xl"
								pb="4px"
								border="1px solid #f1f5f9"
								bg="#f8fafc"
							>
								<Flex
									alignItems="center"
									p="6px 12px"
									borderBottom="1px solid #f1f5f9"
								>
									<Icon
										name="search"
										size="md"
										color="#475569"
									/>
									<ChakraKBarSearch
										placeholder="Search anything..."
										w="full"
										bg="transparent"
										_focus={{ outline: "none" }}
										py="5px"
										ml="1em"
										_placeholder={{ color: "#94a3b8" }}
									/>
								</Flex>
							</Box>
							<RenderResults className={fontClassName} />
						</ChakraKBarAnimator>
					</ChakraKBarPositioner>
				</ChakraKBarPortal>
			) : null}
		</>
	);
};

export default Layout;

function RenderResults({ className }) {
	const { results } = useMatches();

	// Chakra wrapper for KBarResults
	const ChakraKBarResults = chakra(KBarResults);

	if (results.length) {
		return (
			<ChakraKBarResults
				items={results}
				onRender={({ item, active }) =>
					typeof item === "string" ? (
						<Text
							className={className}
							fontSize="sm"
							px="4px"
							pt="6px"
							pb="3px"
							color="#0f172a"
						>
							{item}
						</Text>
					) : (
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
									color={active ? "#0f172a" : "#334155"}
									mr="10px"
								>
									{item.icon}
								</Box>
							)}
							<Box overflow="hidden">
								<Text color={active ? "#0f172a" : "#334155"}>
									{item.name}
								</Text>
								{item.subtitle && (
									<Text
										fontSize="xs"
										isTruncated={true}
										color={active ? "#475569" : "#64748b"}
									>
										{item.subtitle}
									</Text>
								)}
							</Box>
						</Flex>
					)
				}
			/>
		);
	} else {
		return (
			<Text px="4" py="6" textAlign="center" color="#475569">
				Nothing found...
			</Text>
		);
	}
}
