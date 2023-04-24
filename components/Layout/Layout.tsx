import { Box, Flex } from "@chakra-ui/react";
import { useLayoutContext } from "contexts/LayoutContext";
import { useState } from "react";
import { NavBar, SideBar } from "..";

const Layout = ({ isLoggedIn, children }) => {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const { isNavHidden } = useLayoutContext();

	return isLoggedIn ? (
		<Box w={"full"}>
			{!isNavHidden && <NavBar setNavOpen={setIsNavOpen} />}

			<Flex>
				<SideBar navOpen={isNavOpen} setNavOpen={setIsNavOpen} />
				{/* Main Content here */}

				<Box
					minH={{
						base: "calc(100vh - 56px)",
						sm: "calc(100vh - 56px)",
						md: "calc(100vh - 50px)",
						lg: "calc(100vh - 60px)",
						xl: "calc(100vh - 50px)",
						"2xl": "calc(100vh - 90px)",
					}}
					w={"full"}
					bg={"bg"}
					overflow={"hidden"}
				>
					<Box
						overflowY={"auto"}
						css={{
							"&::-webkit-scrollbar": {
								width: "0.6vw",
							},
							"&::-webkit-scrollbar-track": {
								width: "0.6vw",
							},
							"&::-webkit-scrollbar-thumb": {
								background: "#D2D2D2",
								borderRadius: "5px",
							},
						}}
					>
						{children}
					</Box>
				</Box>
			</Flex>
		</Box>
	) : (
		<>{children}</>
	);
};

export default Layout;
