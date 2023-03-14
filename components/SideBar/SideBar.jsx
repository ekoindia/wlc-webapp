import {
	Box,
	Center,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	useDisclosure,
	useMediaQuery,
} from "@chakra-ui/react";
import { adminMenu } from "constants";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Icon } from "..";

const SideBarMenu = ({ className = "", ...props }) => {
	const router = useRouter();
	const [currentRoute, setcurrentRoute] = useState();
	const [isSmallerThan1024] = useMediaQuery("(max-width: 1024px)");

	useEffect(() => {
		setcurrentRoute(router.pathname.split("/")[2]);
	}, [router.asPath]);

	return (
		<Box
			minW={{
				base: "full",
				sm: "55vw",
				md: "13.5vw",
				lg: "200px",
				xl: "200px",
				"2xl": "250px",
			}}
			bgColor={"accent.DEFAULT"}
			height={"100%"}
		>
			<Flex>
				<Box
					bg="accent.DEFAULT"
					borderRight="12px"
					height={"100%"}
					w={"full"}
				>
					{adminMenu?.map((menu, index) => (
						<Link
							href={menu.link}
							key={index}
							w={"full"}
							_hover={{ textDecor: "none" }}
						>
							<Flex
								key={index}
								fontSize={{
									base: "14px",
									sm: "14px",
									md: "12px",
									lg: "12px",
									xl: "12px",
									"2xl": "16px",
								}}
								gap="13px"
								color="#FFFFFF"
								align="center"
								px={{ base: "3", md: "3", lg: "2", "2xl": "4" }}
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
								borderLeft="8px"
								borderLeftColor={
									currentRoute === menu.link.split("/")[2]
										? "#FE7D00"
										: "transparent"
								}
							>
								<Center
									w={{
										base: "20px",
										sm: "20px",
										md: "18px",
										lg: "18px",
										xl: "18px",
										"2xl": "27px",
									}}
									h={{
										base: "20px",
										sm: "20px",
										md: "18px",
										lg: "18px",
										xl: "18px",
										"2xl": "20px",
									}}
								>
									<Icon name={menu.icon} width={"100%"} />
								</Center>
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

const SideBar = (props) => {
	return (
		<>
			<Box display={{ base: "flex", lg: "none" }}>
				<MenuBar props={props} />
			</Box>
			<Box display={{ base: "none", lg: "flex" }}>
				<SideBarMenu />
			</Box>
		</>
	);
};

export default SideBar;
