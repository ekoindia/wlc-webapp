import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import { useState } from "react";
import { Breadcrumbs, NavBar, SideBar } from "..";

const Layout = (props) => {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const [isSmallerThan770] = useMediaQuery("(max-width: 1400px)");

	return (
		<Box w={"full"} minH={"100vh"}>
			<NavBar
				setNavOpen={setIsNavOpen}
				isSmallerThan770={isSmallerThan770}
			/>
			<Flex width={"full"} height={"calc(100vh - 4.5vw)"}>
				<SideBar
					navOpen={isNavOpen}
					setNavOpen={setIsNavOpen}
					isSmallerThan770={isSmallerThan770}
				/>
				{/* Main Content here */}

				<Box minH={"calc(100vh- 4.5vw)"} w={"full"}>
					<Box
						w={"full"}
						h={"100%"}
						overflowY={"scroll"}
						p={"1.2vw"}
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
						{!isSmallerThan770 && <Breadcrumbs />}

						{props.children}
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};

export default Layout;

// import { Box, Show } from "@chakra-ui/react";
// import { Breadcrumbs } from "..";
// import NavSide from "./NavSide";

// // const {Content} = Layout;

// const Layout = (props) => {
// 	return (
// 		<Box bg="bg">
// 			<NavSide>
// 				<Box p={4}>
// 					<Show breakpoint="(min-width: 450px)">
// 						<Breadcrumbs />
// 					</Show>
// 					{props.children}
// 				</Box>
// 			</NavSide>
// 		</Box>
// 	);
// };

// export default Layout;
