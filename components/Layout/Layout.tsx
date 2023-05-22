import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { useLayoutContext, useSession } from "contexts";
import { NavBar, SideBar } from "..";

const Layout = ({ children }) => {
	const { isNavHidden } = useLayoutContext();
	const { isLoggedIn } = useSession();
	const { isOpen, onOpen, onClose } = useDisclosure(); // For controlling the left navigation drawer

	return isLoggedIn ? (
		<Box w={"full"}>
			{!isNavHidden && (
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
		</Box>
	) : (
		<>{children}</>
	);
};

export default Layout;
