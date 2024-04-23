import { Box, Flex, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { ActionIcon, useKBarReady } from "components/CommandBar";
import { useAppSource, useGlobalSearch, usePubSub, useSession } from "contexts";
import { useDelayToggle } from "hooks";
import { Priority, useRegisterActions } from "kbar";
import dynamic from "next/dynamic";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useMemo, useState } from "react";
import { ANDROID_ACTION, doAndroidAction } from "utils";
import { PageLoader /*,NavBar, SideBar */ } from "..";
import { NavHeight } from "../NavBar";

// Lazy-load the CommandBarBox component
const CommandBarBox = dynamic(() => import("../CommandBar/CommandBarBox"), {
	ssr: false,
});

// Lazy-load the sidebar component
const SideBar = dynamic(() => import("../SideBar").then((pkg) => pkg.SideBar), {
	ssr: false,
});

// Lazy-load the NavBar component
const NavBar = dynamic(() => import("../NavBar").then((pkg) => pkg.NavBar), {
	ssr: false,
});

/**
 * The default page layout component
 * @param {String} appName - The name of the application. This will be displayed in the browser titlebar.
 * @param {Object} pageMeta - The page meta data.
 * @param {Boolean} pageMeta.isSubPage - If the page is a sub page, then the layout will not render the top navbar (Header) on small screens.
 * @param {String} pageMeta.title - The page title. This will be displayed in the browser titlebar.
 * @param {Boolean} pageMeta.hideMenu - If true, then the layout will not render the left navigation drawer.
 */
const Layout = ({ appName, pageMeta, fontClassName, children }) => {
	const { isSubPage, title, hideMenu } = pageMeta;

	const { isLoggedIn } = useSession();
	const { isOpen, onOpen, onClose } = useDisclosure(); // For controlling the left navigation drawer

	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	const { publish, TOPICS } = usePubSub();

	const { businessActions } = useGlobalSearch(); // Get registered "My Business" actions for the Command bar

	const { isAndroid, setNativeVersion } = useAppSource();

	const [isPageLoading, setIsPageLoading] = useState(false);

	// Check if CommandBar is loaded...
	const { ready } = useKBarReady();

	// Delay load non-essential components...
	const [loadNavBar] = useDelayToggle(100);
	const [loadSidebar] = useDelayToggle(100);
	const [loadKbarBox] = useDelayToggle(500);

	// Setup Android Listener...
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
							h={NavHeight}
						>
							{loadNavBar ? <NavBar setNavOpen={onOpen} /> : null}
						</Box>
					)}

					{hideMenu ? (
						<>{children}</>
					) : (
						<Flex>
							{loadSidebar ? (
								<SideBar
									navOpen={isOpen}
									setNavClose={onClose}
								/>
							) : (
								// Placeholder for the sidebar
								<Box
									w="250px"
									minW="250px"
									display={{ base: "none", md: "block" }}
								></Box>
							)}

							{/* Main Content here */}

							<Box
								minH={{
									base: `calc(100vh - ${NavHeight.base})`,
									md: `calc(100vh - ${NavHeight.md})`,
									lg: `calc(100vh - ${NavHeight.lg})`,
									"2xl": `calc(100vh - ${NavHeight["2xl"]})`,
								}}
								w={"full"}
								bg={"bg"}
								overflow={"hidden"}
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
				</Box>
			) : (
				<>{children}</>
			)}

			{/* Load CommandBar Popup component */}
			{isLoggedIn && ready && loadKbarBox ? (
				<CommandBarBox fontClassName={fontClassName} />
			) : null}
		</>
	);
};

export default Layout;
