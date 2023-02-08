import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import { useState } from "react";
import { Breadcrumbs, NavBar, SideBar } from "..";

const Layout = (props) => {
	const [isNavOpen, setIsNavOpen] = useState(false);
	return (
		<Box w={"full"} minH={"100vh"}>
			<NavBar setNavOpen={setIsNavOpen} />
			<Flex
				width={"full"}
				height={{
					base: "calc(100vh - 12.2vw)",
					sm: "calc(100vh - 10vw)",
					md: "calc(100vh - 4.5vw)",
				}}
			>
				<SideBar navOpen={isNavOpen} setNavOpen={setIsNavOpen} />
				{/* Main Content here */}

				<Box
					minH={"calc(100vh- 4.5vw)"}
					w={"full"}
					bg={"bg"}
					overflow={"hidden"}
				>
					<Box
						w={"full"}
						h={"100%"}
						overflowY={"scroll"}
						// p={"1vw"}
						// pr={"0.6vw"}
						p={{ base: "4vw", sm: "3vw", md: "1vw", "2xl": ".8vw" }}
						pb={"0px"}
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
						<Breadcrumbs />

						{props.children}
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};

export default Layout;
