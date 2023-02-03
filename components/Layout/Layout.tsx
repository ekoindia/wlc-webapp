import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import { useState } from "react";
import { Breadcrumbs, NavBar, SideBar } from "..";

const Layout = (props) => {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const [isSmallerThan770] = useMediaQuery("(max-width: 768px)");

	return (
		<Box w={"full"} minH={"100vh"}>
			<NavBar
				setNavOpen={setIsNavOpen}
				isSmallerThan770={isSmallerThan770}
			/>
			<Flex
				width={"full"}
				height={{
					base: "calc(100vh - 12.2vw)",
					sm: "calc(100vh - 4.5vw)",
				}}
			>
				<SideBar
					navOpen={isNavOpen}
					setNavOpen={setIsNavOpen}
					isSmallerThan770={isSmallerThan770}
				/>
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
						p={{ base: "4.5vw", md: "1.2vw" }}
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
						<Breadcrumbs isSmallerThan770={isSmallerThan770} />

						{props.children}
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};

export default Layout;
