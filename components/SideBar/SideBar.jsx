import {
	Box,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	useDisclosure,
	useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Icon } from "..";
import { adminMenu } from "../../constants/adminMenu";

const SideBarMenu = ({ className = "", ...props }) => {
	const router = useRouter();
	const [currentRoute, setcurrentRoute] = useState();
	const [isSmallerThan769] = useMediaQuery("(max-width: 440px)");

	useEffect(() => {
		setcurrentRoute(router.pathname.split("/")[2]);
	}, [router.asPath]);

	return (
		<Box
			minW={isSmallerThan769 ? "full" : "13.5vw"}
			bgColor={"accent.DEFAULT"}
			height={"100%"}
		>
			<Flex>
				<Box bg="#11299E" borderRight="12px" height={"100%"} w={"full"}>
					{adminMenu.map((menu, index) => (
						<Link
							href={menu.link}
							key={index}
							w={"full"}
							_hover={{ textDecor: "none" }}
						>
							<Flex
								key={index}
								fontSize={isSmallerThan769 ? "3.6vw" : ".85vw"}
								gap="10px"
								color="#FFFFFF"
								align="center"
								px={{ base: "2", lg: "3", "2xl": "4" }}
								py={{
									base: "4",
									md: "3",
									xl: "3.5",
									"2xl": "5",
								}}
								w={"full"}
								role="group"
								cursor="pointer"
								borderBottom="1px solid #1F3ABC"
								bg={
									currentRoute === menu.link.split("/")[2] &&
									"#081E89"
								}
								borderLeft={isSmallerThan769 ? "6px" : "8px"}
								borderLeftColor={
									currentRoute === menu.link.split("/")[2]
										? "#FE7D00"
										: "transparent"
								}
							>
								<Box>
									<Icon
										name={menu.icon}
										style={
											isSmallerThan769
												? {
														width: "6vw",
														height: "6vw",
												  }
												: {
														width: "1vw",
														height: "1vw",
												  }
										}
									/>
								</Box>
								{menu.name}
							</Flex>
						</Link>
					))}
				</Box>
				{/* {rest.children} */}
			</Flex>
		</Box>
	);
};

const MenuBar = ({ props }) => {
	const { navOpen, setNavOpen } = props;
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Drawer
			autoFocus={false}
			isOpen={navOpen}
			placement="left"
			onClose={onClose}
			returnFocusOnClose={false}
			onOverlayClick={() => {
				setNavOpen(false);
			}}
			size="full"
		>
			<DrawerOverlay />
			<DrawerContent maxW={"250px"} boxShadow={"none"}>
				<SideBarMenu />
			</DrawerContent>
		</Drawer>
	);
};

const SideBar = ({ isSmallerThan770, ...props }) => {
	return (
		<>{isSmallerThan770 ? <MenuBar props={props} /> : <SideBarMenu />}</>
	);
};

export default SideBar;
