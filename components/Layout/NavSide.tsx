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
	HStack,
	IconButton,
	Link,
	Menu,
	MenuButton,
	MenuList,
	Stack,
	StackDivider,
	Text,
	useColorModeValue,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";

import { ChevronRightIcon } from "@chakra-ui/icons";
import { adminMenu } from "constants/adminMenu";
import { ReactNode, ReactText } from "react";
import { FiMenu } from "react-icons/fi";
import { Buttons, IconButtons, Icon } from "../";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useRouter } from "next/router";

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
				<DrawerContent>
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
	return (
		<Flex>
			<Box
				// mt="90px"
				// transition="3s ease"
				bg="#11299E"
				borderRight="12px"
				borderRightColor={useColorModeValue("gray.200", "gray.700")}
				w="250px"
				// pos="fixed"
				{...rest}
				minHeight="90vh"
				maxHeight="container"
			>
				<Flex mx="9" justifyContent="space-between">
					<CloseButton
						display={{ base: "flex", md: "none" }}
						onClick={onClose}
					/>
				</Flex>
				{adminMenu.map((menu, idx) => (
					<NavItem
						key={idx}
						gap="10px"
						iconName={menu.icon}
						onClick={() => router.push(menu.link)}
					>
						{menu.name}
					</NavItem>
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
			_hover={{
				color: "white",
			}}
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
			<Box ml={30}>
				<img src="/icons/logoimage.png" alt="asd" />
			</Box>
			<IconButton
				display={{ base: "flex", md: "none" }}
				onClick={onOpen}
				variant="outline"
				aria-label="open menu"
				icon={<FiMenu />}
			/>

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
									size={"sm"}
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
									<Text
										fontSize="18px"
										color="#0F0F0F"
										fontWeight={600}
									>
										Akash Enterprises
									</Text>
									<Text fontSize="14px" color="#1F5AA7">
										Logged in as admin
									</Text>
								</VStack>
								<Box pl={5}>
									<img src="/icons/profiledropdown.svg" />
								</Box>
							</HStack>
						</MenuButton>
						<MenuList
							h="470px"
							w="395px"
							mr="20px"
							boxShadow="0px 6px 10px #00000033"
							border="1px solid #D2D2D2"
							borderRadius="10px"
						>
							<Card>
								<Box bg={"#1F3ABC"} h="120px">
									<Box ml="20px">
										<Box
											display="flex"
											mt="20px"
											gap="50px"
										>
											<Box
												fontSize={"14px"}
												color={"highlight"} // need to update the color
												borderRadius="15px"
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

										<Box color={"focusbg"} fontSize={10}>
											angeltech.google.co.in
										</Box>
										<Box>
											<Box
												display={"flex"}
												alignItems={"center"}
												color={"focusbg"}
												fontSize={10}
												gap="80px"
											>
												<Box as={"span"}>
													+91 9871679433
													<IconButtons
														iconPath="/icons/pen.svg"
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
													title="View Profile"
													rightIcon={
														<ChevronRightIcon />
													}
												/>
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
											Business Contact
											<img src="/icons/forwardarrow.svg" />
										</Flex>

										<Flex justifyContent="space-between">
											Need Help
											<img src="/icons/forwardarrow.svg" />
										</Flex>

										<Flex justifyContent="space-between">
											Help Center
											<img src="/icons/forwardarrow.svg" />
										</Flex>

										<Flex justifyContent="space-between">
											Settings
											<img src="/icons/forwardarrow.svg" />
										</Flex>
									</Stack>
								</CardBody>
							</Card>
							<Box mt={50} ml={10} color={"error"} fontSize={14}>
								Logout
							</Box>
						</MenuList>
					</Menu>
				</Flex>
			</HStack>
		</Flex>
	);
};
