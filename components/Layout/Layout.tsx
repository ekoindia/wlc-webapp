import { Box, Flex } from "@chakra-ui/react";
import { useLayoutContext, useSession } from "contexts";
import { useState } from "react";
import { NavBar, SideBar } from "..";

const Layout = ({ children }) => {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const { isNavHidden } = useLayoutContext();
	const { isLoggedIn } = useSession();

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
					<NavBar setNavOpen={setIsNavOpen} />
				</Box>
			)}

			<Flex>
				<SideBar navOpen={isNavOpen} setNavOpen={setIsNavOpen} />

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
