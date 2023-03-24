import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import { useState } from "react";
import { Breadcrumbs, NavBar, SideBar } from "..";

const Layout = (props) => {
	const { children, propComp } = props;
	const [isNavOpen, setIsNavOpen] = useState(false);
	const [isNav, setNav] = useState(true);
	const [headingObj, setHeadingObj] = useState({
		title: null,
		hasIcon: false,
	});
	const [isSmallerThan769] = useMediaQuery("(max-width: 769px)");

	return (
		<Box w={"full"} minH={"100vh"}>
			<NavBar
				setNavOpen={setIsNavOpen}
				isNavVisible={isNav}
				isSmallerThan769={isSmallerThan769}
				headingObj={headingObj}
				propComp={propComp}
			/>

			<Flex
				width={"full"}
				height={{
					base: "calc(100vh - 56px)",
					sm: "calc(100vh - 56px)",
					md: "calc(100vh - 50px)",
					lg: "calc(100vh - 60px)",
					xl: "calc(100vh - 50px)",
					"2xl": "calc(100vh - 90px)",
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
						overflowY={"auto"}
						// p={"1vw"}
						// pr={"0.6vw"}
						p={{
							base: "0px",
							sm: "0px",
							md: "2vw",
							"2xl": "1.5vw",
						}}
						pb={{ base: "20px", md: "30px", "2xl": "30px" }}
						// mt="20px"
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
						{/* <Breadcrumbs
							setNav={setNav}
							setHeadingObj={setHeadingObj}
							isNavVisible={isNav}
							isSmallerThan769={isSmallerThan769}
							propComp={propComp}
						/> */}

						{children}
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};

export default Layout;
