import { Box, Flex, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { ActionIcon } from "components/CommandBar";
import { useAppSource, useGlobalSearch, usePubSub, useSession } from "contexts";
import { Priority, useRegisterActions } from "kbar";
import dynamic from "next/dynamic";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useMemo, useState } from "react";
import { ANDROID_ACTION, doAndroidAction } from "utils";
import { NavBar, PageLoader, SideBar } from "..";

// Lazy-load the CommandBarBox component
const CommandBarBox = dynamic(() => import("../CommandBar/CommandBarBox"), {
	ssr: false,
});

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

	const { publish, TOPICS } = usePubSub();

	const { businessActions } = useGlobalSearch(); // Get registered "My Business" actions for the Command bar

	const { isAndroid, setNativeVersion } = useAppSource();

	const [isPageLoading, setIsPageLoading] = useState(false);
	Router.events.on("routeChangeStart", () => setIsPageLoading(true));
	Router.events.on("routeChangeComplete", () => setIsPageLoading(false));
	Router.events.on("routeChangeError", () => setIsPageLoading(false));

	// Setup Android Listener...
	useEffect(() => {
		if (typeof window !== "undefined" && isAndroid) {
			// Inform Android wrapper app that the page has loaded...
			doAndroidAction(ANDROID_ACTION.WEBAPP_READY);

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
	}, [businessActions]);

	useRegisterActions(businessSearch, [businessSearch]);

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

			{isLoggedIn ? (
				<CommandBarBox fontClassName={fontClassName} />
			) : null}
		</>
	);
};

export default Layout;
