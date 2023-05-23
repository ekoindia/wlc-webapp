import { Box, Flex, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { useSession } from "contexts";
import Head from "next/head";
import { NavBar, SideBar } from "..";

/**
 * The default page layout component
 * @param {String} appName - The name of the application. This will be displayed in the browser titlebar.
 * @param {Object} pageMeta - The page meta data.
 * @param {Boolean} pageMeta.isSubPage - If the page is a sub page, then the layout will not render the top navbar (Header) on small screens.
 * @param {String} pageMeta.title - The page title. This will be displayed in the browser titlebar.
 */
const Layout = ({ appName, pageMeta, children }) => {
	const { isSubPage, title, hideMenu } = pageMeta;

	// const { isNavHidden } = useLayoutContext();
	const { isLoggedIn } = useSession();
	const { isOpen, onOpen, onClose } = useDisclosure(); // For controlling the left navigation drawer

	const isSmallScreen = useBreakpointValue({ base: true, md: false });

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
				<Box w={"full"}>
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
		</>
	);
};

export default Layout;
