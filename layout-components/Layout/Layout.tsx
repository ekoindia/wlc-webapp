import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { PageLoader /*,NavBar, SideBar */ } from "components";
import { useBottomAppBarItems } from "components/BottomAppBar";
import { ActionIcon, useKBarReady } from "components/CommandBar";
import { NavHeight } from "components/NavBar";
import { useAppSource, useGlobalSearch, usePubSub, useSession } from "contexts";
import { useDelayToggle, useIsSubPage } from "hooks";
import { Priority, useRegisterActions } from "kbar";
import dynamic from "next/dynamic";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useMemo, useState } from "react";
import { ANDROID_ACTION, doAndroidAction } from "utils";

// Lazy-load the CommandBarBox component
const CommandBarBox = dynamic(
	() => import("components/CommandBar/CommandBarBox"),
	{
		ssr: false,
	}
);

// Lazy-load the sidebar component
const SideBar = dynamic(
	() => import("components/SideBar").then((pkg) => pkg.SideBar),
	{
		ssr: false,
	}
);

// Lazy-load the NavBar component
const NavBar = dynamic(
	() => import("components/NavBar").then((pkg) => pkg.NavBar),
	{
		ssr: false,
	}
);

// Lazy-load the DynamicPopupModuleLoader component
const DynamicPopupModuleLoader = dynamic(
	() =>
		import("layout-components/DynamicPopupModuleLoader").then(
			(pkg) => pkg.DynamicPopupModuleLoader
		),
	{
		ssr: false,
	}
);

// Lazy-load the BottomAppBar component
const BottomAppBar = dynamic(
	() => import("components/BottomAppBar").then((pkg) => pkg.BottomAppBar),
	{
		ssr: false,
	}
);

/**
 * The default page layout component
 * @param {string} appName - The name of the application. This will be displayed in the browser titlebar.
 * @param {object} pageMeta - The page meta data.
 * @param {boolean} pageMeta.isSubPage - If the page is a sub page, then the layout will not render the top navbar (Header) on small screens.
 * @param {string} pageMeta.title - The page title. This will be displayed in the browser titlebar.
 * @param {boolean} pageMeta.hideMenu - If true, then the layout will not render the left navigation drawer.
 * @param {boolean} pageMeta.pageHeight - If true, then the layout will take no more than full height of the screen.
 * @param {boolean} pageMeta.isFixedBottomAppBar - If true, then the bottom app bar will be fixed to the bottom of the screen.
 * @param {string} [fontClassName] - A class name to apply to the layout for setting a custom Font.
 */
const Layout = ({ appName, pageMeta, fontClassName = null, children }) => {
	const { isSubPage, title, hideMenu, pageHeight, isFixedBottomAppBar } =
		pageMeta || {};

	const { isLoggedIn, isOnboarding } = useSession();
	// const { isOpen: isSidebarOpen, onOpen, onClose } = useDisclosure(); // For controlling the left navigation drawer from the top header bar on small screens

	const isSmallScreen = useBreakpointValue(
		{ base: true, md: false, lg: false },
		{ ssr: false }
	);

	// Which screen-sizes to show the bottom app bar, instead of the left navigation drawer?
	const isBottomAppBarScreen = useBreakpointValue(
		{ base: true, md: true, lg: false },
		{ ssr: true }
	);

	const { publish, TOPICS } = usePubSub();

	const { businessActions } = useGlobalSearch(); // Get registered "My Business" actions for the Command bar

	const { isAndroid, setNativeVersion } = useAppSource();

	const [isPageLoading, setIsPageLoading] = useState(false);

	// Check if CommandBar is loaded...
	const { ready } = useKBarReady();

	// Get the bottom bar items
	const bottomAppBarItems = useBottomAppBarItems();

	// useIsSubPage calculates whether it is a sub-page based on URL path hierarchy.
	// If `isSubPage` is passed (not undefined) form the page metadata, it is returned as it is (no calculation).
	// It is used to decide whether top Appbar will be shown or not (for subpages, we show a custom page navbar with back button).
	const resolvedIsSubPage = useIsSubPage(isSubPage);

	// Delay load non-essential components...
	const [loadNavBar] = useDelayToggle(100);
	const [loadSidebar] = useDelayToggle(100);
	const [loadKbarBox] = useDelayToggle(500);

	// One Time Setup: Setup Android Listener & Route Change Listeners...
	// MARK: Listeners
	useEffect(() => {
		// Show page-loading animation on route change
		Router.events.on("routeChangeStart", () => setIsPageLoading(true));
		Router.events.on("routeChangeComplete", () => setIsPageLoading(false));
		Router.events.on("routeChangeError", () => setIsPageLoading(false));

		// Android action listener
		if (typeof window !== "undefined" && isAndroid) {
			// Android action response listener
			window["callFromAndroid"] = (action, data) => {
				console.log("[_app.tsx] callFromAndroid:: ", action, data);

				// Set the Android app version
				if (action === ANDROID_ACTION.SET_NATIVE_VERSION) {
					setNativeVersion(parseInt(data));
					return;
				}

				publish(TOPICS.ANDROID_RESPONSE, { action, data });
			};

			// Inform Android wrapper app that the page has loaded and is ready to listen to messages from Android...
			doAndroidAction(ANDROID_ACTION.WEBAPP_READY);
		}
	}, []);

	// Add Business section of Command bar...
	// TODO: Move this to a wrapper component for KBar
	// Prepare the Command Bar actions for "My Business" section
	// MARK: Set KBar
	const businessSearch = useMemo(() => {
		console.log(
			"[DynamicSearchController] Preparing to register businessActions: ",
			businessActions
		);

		if (!ready) return [];

		return [
			{
				id: "my-business",
				name: "My Business Details…",
				// subtitle: "",
				icon: (
					<ActionIcon
						icon="business-center"
						size="sm"
						style="filled"
						iconSize="24px"
						// color="#10b981"
					/>
				),
				shortcut: ["$mod+b"],
				// keywords: "signout quit close",
				// section: "System",
				priority: Priority.LOW,
			},
			...businessActions,
		];
	}, [businessActions, ready]);

	useRegisterActions(businessSearch, [businessSearch]);

	// MARK: JSX
	return (
		<>
			<Head>
				{title ? (
					<title>
						{title}
						{appName ? ` | ${appName}` : ""}
					</title>
				) : null}
				{isLoggedIn ? (
					<link
						rel="icon"
						type="image/svg+xml"
						href="/favicon.svg"
						key="favicon"
					/>
				) : (
					<link
						rel="icon"
						type="image/svg+xml"
						href="/favicon.closed.svg"
						key="favicon"
					/>
				)}
			</Head>

			{/* Show page-loading animation */}
			{isPageLoading && <PageLoader />}

			{/* Show any dynamic popup modules */}
			<DynamicPopupModuleLoader />

			{isLoggedIn ? (
				<Box w={"full"} className={fontClassName}>
					{/*
						MARK: Top NavBar
						Hide top navbar on small screen if this is a sub-page
						(shows it's own back button in the top header)
					*/}
					{isSmallScreen && resolvedIsSubPage ? null : (
						<Box
							sx={{
								"@media print": {
									display: "none",
								},
							}}
							h={NavHeight}
						>
							{loadNavBar ? <NavBar /> : null}
						</Box>
					)}

					{hideMenu ? (
						// MARK: No-Menu?
						<>{children}</>
					) : (
						<Flex>
							{/*
								Load the sidebar component
								MARK: SideBar
							*/}
							{isBottomAppBarScreen ? null : loadSidebar ? (
								<SideBar />
							) : (
								// Placeholder for the sidebar
								<Box
									w="250px"
									minW="250px"
									display={{ base: "none", md: "block" }}
								></Box>
							)}

							{/*
								Main Content here
								MARK: MAIN
							*/}
							<Box
								as="main"
								minH={{
									base: `calc(100vh - ${NavHeight.base})`,
									md: `calc(100vh - ${NavHeight.md})`,
									lg: `calc(100vh - ${NavHeight.lg})`,
									"2xl": `calc(100vh - ${NavHeight["2xl"]})`,
								}}
								maxH={
									pageHeight
										? {
												base: `calc(100vh - ${NavHeight.base})`,
												md: `calc(100vh - ${NavHeight.md})`,
												lg: `calc(100vh - ${NavHeight.lg})`,
												"2xl": `calc(100vh - ${NavHeight["2xl"]})`,
											}
										: undefined
								}
								w={"full"}
								bg={"bg"}
								overflow={"hidden"}
								// overflowY={
								// 	pageHeight ? "auto" : "hidden"
								// }
								sx={{
									"@media print": {
										bg: "none",
									},
								}}
							>
								{children}
							</Box>
						</Flex>
					)}

					{/*
						MARK: BottomAppBar
					*/}
					{!isOnboarding && isBottomAppBarScreen ? (
						<Box
							className="layout-bottom-app-bar"
							pos="fixed"
							w="100%"
							bottom="0"
							left="0"
							right="0"
							sx={{
								"@media print": {
									display: "none",
								},
							}}
						>
							<BottomAppBar
								{...{
									items: bottomAppBarItems,
									isFixedBottomAppBar,
								}}
							/>
						</Box>
					) : null}
				</Box>
			) : (
				<>{children}</>
			)}

			{/*
				Load CommandBar Popup component
				MARK: KBar Popup
			*/}
			{isLoggedIn && ready && loadKbarBox ? (
				<CommandBarBox fontClassName={fontClassName} />
			) : null}
		</>
	);
};

export default Layout;
