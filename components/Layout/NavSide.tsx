import {
	Avatar,
	Box,
	BoxProps,
	Card,
	CardBody,
	CloseButton,
	Drawer,
	DrawerContent,
	Flex,
	FlexProps,
	Hide,
	HStack,
	IconButton,
	Image,
	Menu,
	MenuButton,
	MenuList,
	Stack,
	StackDivider,
	Text,
	useColorModeValue,
	useDisclosure,
	useMediaQuery,
	VStack,
} from "@chakra-ui/react";

import { adminMenu } from "constants/adminMenu";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, ReactText, useEffect, useState } from "react";
import { Buttons, Icon, IconButtons } from "../";

export default function SidebarWithHeader({
	children,
}: {
	children: ReactNode;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Box
			minH="100vh"
			// bg={useColorModeValue("gray.100", "gray.900")}
		>
			<MobileNav onOpen={onOpen} />
			<SidebarContent
				onClose={() => onClose}
				display={{ base: "none", md: "block" }}
			>
				<Box p="4">{children}</Box>
			</SidebarContent>
			<Drawer
				autoFocus={false}
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
				size="full"
			>
				<DrawerContent bgColor={"#ffffff85"}>
					<SidebarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>
			{/* mobilenav */}
		</Box>
	);
}

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	const router = useRouter();
	const [currentRoute, setcurrentRoute] = useState("my-network");
	const [isLargerThan769] = useMediaQuery("(max-width: 769px)");

	useEffect(() => {
		setcurrentRoute(router.pathname.split("/")[2]);
	}, [router.asPath]);

	return (
		<Flex onClick={onClose}>
			<Box
				bg="#11299E"
				borderRight="12px"
				borderRightColor={useColorModeValue("gray.200", "gray.700")}
				w="250px"
				{...rest}
				height={isLargerThan769 ? "100vh" : "92vh"}
				paddingTop={".5"}
			>
				<Flex mx="9" justifyContent="space-between"></Flex>
				{adminMenu.map((menu, idx) => (
					<Link href={menu.link} key={idx} legacyBehavior={true}>
						<NavItem
							key={idx}
							gap="10px"
							iconName={menu.icon}
							bg={
								currentRoute === menu.link.split("/")[2]
									? "#081E89"
									: ""
							}
							borderLeft="8px"
							borderLeftColor={
								currentRoute === menu.link.split("/")[2]
									? "#FE7D00"
									: "transparent"
							}
						>
							{/* <a
              className={`cursor-pointer ${
                router.pathname === menu.link
                  ? 'text-blue-500'
                  : 'hover:bg-gray-900 hover:text-blue-500'
              }`}		
            ></a> */}
							{menu.name}
						</NavItem>
					</Link>
				))}
			</Box>
			{rest.children}
		</Flex>
	);
};

import { IconNameType } from "../Icon/Icon";

interface NavItemProps extends FlexProps {
	iconName: IconNameType;
	children: ReactText;
	url?: string;
}
const NavItem = ({ iconName, url, children, ...rest }: NavItemProps) => {
	return (
		// <Link
		// 	href={url}
		// 	style={{ textDecoration: "none" }}
		// 	_focus={{
		// 		bg:" #081E89",
		// 		border: "1px solid #1F3ABC"
		// 	 }}

		// >

		<Flex
			fontSize="16px"
			color="#FFFFFF"
			align="center"
			p="4"
			role="group"
			cursor="pointer"
			borderBottom="1px solid #1F3ABC"
			// _hover={{
			// 	color: "white",
			// 	borderLeft: "8px solid #FE7D00",
			// 	bg: "#081E89",
			// }}
			// background =" #081E89"
			{...rest}
		>
			{/* {icon && (
					<Icon
						mr="4"
						fontSize=""
						_groupHover={{
							color: "white",
						}}
						// as={icon} // commenting this so that I can deploy
					/>
				)} */}
			<Box>
				<Icon
					name={iconName}
					style={{ width: "27px", height: "27px" }}
				/>
			</Box>
			{children}
		</Flex>
		// </Link>
	);
};

interface MobileProps extends FlexProps {
	onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
	return (
		<Flex
			justify="space-between"
			height="90px"
			align="center"
			bg="white"
			boxShadow="0px 3px 10px #0000001A"
			{...rest}
		>
			<Box display={"flex"} alignItems={"center"} px={"4"}>
				<IconButton
					display={{ base: "flex", md: "none" }}
					onClick={onOpen}
					aria-label="open menu"
					icon={<Icon name="nav-menu" />}
					bgColor="transparent"
				/>
				{/* <img src="/icons/logoimage.png" alt="asd" /> */}
				<Image src="/icons/logoimage.png" alt="logo" px={"2.5"} />
			</Box>
			<Hide above="sm">
				<Avatar
					h="48px"
					w="48px"
					src={
						"https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
					}
					mx={"4"}
				/>
			</Hide>
			<Hide below="sm">
				<HStack spacing={{ base: "0", md: "" }}>
					<Flex alignItems={"center"}>
						<Menu>
							<MenuButton
								py={2}
								transition="all 0.3s"
								_focus={{ boxShadow: "none" }}
							>
								<HStack style={{ marginRight: "30PX" }}>
									<Avatar
										h="48px"
										w="48px"
										src={
											"https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
										}
									/>
									<VStack
										display={{ base: "none", md: "flex" }}
										alignItems="flex-start"
										spacing="5px"
										ml="2"
									>
										{" "}
										<Box display="flex" alignItems="center">
											<Text
												fontSize="18px"
												color="#0F0F0F"
												fontWeight={600}
											>
												Akash Enterprises
											</Text>
											<Box pl={5}>
												<img src="/icons/profiledropdown.svg" />
											</Box>
										</Box>
										<Text fontSize="14px" color="#1F5AA7">
											Logged in as admin
										</Text>
									</VStack>
								</HStack>
							</MenuButton>
							<MenuList
								h="470px"
								w="100%"
								mr="20px"
								boxShadow="0px 6px 10px #00000033"
								border="1px solid #D2D2D2"
								borderRadius="10px"
							>
								<Card>
									<Box
										bg={"#1F3ABC"}
										h="120px"
										mt="-10px"
										borderRadius="10px 10px 0px 0px"
									>
										<Box ml="20px">
											<Box
												display="flex"
												mt="20px"
												gap="50px"
											>
												<Box
													fontSize={"14px"}
													color={"highlight"} // need to update the color
												>
													Akash Enterprises
												</Box>
												<Box
													fontSize="10px"
													color={"white"}
													mt="4px"
												>
													(Eko Code: 501837634)
												</Box>
											</Box>

											<Box
												color={"focusbg"}
												fontSize={10}
											>
												angeltech.google.co.in
											</Box>
											<Box pr="15px">
												<Box
													display={"flex"}
													justifyContent="space-between"
													alignItems="center"
													color={"focusbg"}
													fontSize={10}
												>
													<Box>
														+91 9871679433
														<IconButtons
															iconName="mode-edit"
															iconStyle={{
																h: "8px",
																w: "8px",
															}}
															circleStyle={{
																h: "21px",
																w: "21px",
															}}
														></IconButtons>
													</Box>
													<Buttons
														w="108px"
														h="36px"
														fontSize="12px"

														// rightIcon={
														// 	// <ChevronRightIcon />
														// }
													>
														View Profile{" "}
														<Icon
															name="chevron-right"
															// height="10px"
															// width="20px"
														/>
													</Buttons>
												</Box>
											</Box>
										</Box>
									</Box>

									<CardBody>
										<Stack
											divider={<StackDivider />}
											spacing="4"
										>
											<Flex justifyContent="space-between">
												<Text
													style={{
														font: "normal normal medium 14px/36px Inter;",
													}}
												>
													{" "}
													Business Contact{" "}
												</Text>
												<img src="/icons/forwardarrow.svg" />
											</Flex>

											<Flex justifyContent="space-between">
												<Text
													style={{
														font: "normal normal medium 14px/36px Inter;",
													}}
												>
													Need Help
												</Text>
												<img src="/icons/forwardarrow.svg" />
											</Flex>

											<Flex justifyContent="space-between">
												<Text
													style={{
														font: "normal normal medium 14px/36px Inter;",
													}}
												>
													{" "}
													Help Center
												</Text>
												<img src="/icons/forwardarrow.svg" />
											</Flex>

											<Flex justifyContent="space-between">
												<Text
													style={{
														font: "normal normal medium 14px/36px Inter;",
													}}
												>
													Settings
												</Text>
												<img src="/icons/forwardarrow.svg" />
											</Flex>
										</Stack>
									</CardBody>
								</Card>
								<Box
									mt={50}
									ml={10}
									color={"error"}
									fontSize={14}
								>
									Logout
								</Box>
							</MenuList>
						</Menu>
					</Flex>
				</HStack>
			</Hide>
		</Flex>
	);
};
