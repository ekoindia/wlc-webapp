import React, { ReactNode } from "react";
import {
	IconButton,
	Avatar,
	Box,
	CloseButton,
	Flex,
	HStack,
	VStack,
	Icon,
	useColorModeValue,
	Link,
	Drawer,
	DrawerContent,
	Text,
	useDisclosure,
	BoxProps,
	FlexProps,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Stack,
	StackDivider,
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import {
	FiHome,
	FiTrendingUp,
	FiCompass,
	FiStar,
	FiSettings,
	FiMenu,
	FiBell,
	FiChevronDown,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";

interface LinkItemProps {
	name: string;
	icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
	{ name: "My Network", icon: FiHome },
	{ name: "Transaction History", icon: FiTrendingUp },
	{ name: "Invoicing", icon: FiCompass },
	{ name: "Pricing & Commission", icon: FiStar },
	{ name: "Company Profile", icon: FiSettings },
];

export default function SidebarWithHeader({
	children,
}: {
	children: ReactNode;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
			<SidebarContent
				onClose={() => onClose}
				display={{ base: "none", md: "block" }}
			/>
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
			<MobileNav onOpen={onOpen} />
			<Box ml={{ base: 0, md: 60 }} p="4">
				{children}
			</Box>
		</Box>
	);
}

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	return (
		<Box
			mt="90px"
			transition="3s ease"
			bg={"#11299E"}
			borderRight="12px"
			borderRightColor={useColorModeValue("gray.200", "gray.700")}
			w={250}
			pos="fixed"
			h="full"
			{...rest}
		>
			<Flex mx="9" justifyContent="space-between">
				<CloseButton
					display={{ base: "flex", md: "none" }}
					onClick={onClose}
				/>
			</Flex>
			{LinkItems.map((link) => (
				<NavItem key={link.name} icon={link.icon}>
					{link.name}
				</NavItem>
			))}
		</Box>
	);
};

interface NavItemProps extends FlexProps {
	icon: IconType;
	children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
	return (
		<Link
			href="#"
			style={{ textDecoration: "none" }}
			_focus={{ boxShadow: "none" }}
		>
			<Flex
				fontSize="16px"
				color={"#FFFFFF"}
				align="center"
				p="4"
				mx=""
				borderRadius="lg"
				role="group"
				cursor="pointer"
				_hover={{
					bg: "#1F3ABC",
					color: "white",
				}}
				{...rest}
			>
				{icon && (
					<Icon
						mr="4"
						fontSize=""
						_groupHover={{
							color: "white",
						}}
						as={icon}
					/>
				)}
				{children}
			</Flex>
		</Link>
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
			bg="#FFFFFF"
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
									spacing="1px"
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
							w="350px"
							bg={useColorModeValue("white", "gray.900")}
							borderColor={useColorModeValue(
								"gray.200",
								"gray.700"
							)}
						>
							<Card>
								<Box bg={"#1F3ABC"} h={100} display="flex">
									<Box
										fontSize={14}
										color="#FFD93B"
										mt={5}
										ml={2}
										borderRadius="15px"
									>
										Akash Enterprises
										<Box color="#FFFFFF" fontSize={10}>
											angeltech.google.co.in
										</Box>
										<Box color="#FFFFFF" fontSize={10}>
											+91 9871679433 <img src="" />
										</Box>
									</Box>
									<Box
										mt={5}
										ml={20}
										color="#FFFFFF"
										fontSize={10}
									>
										(Eko Code: 501837634)
										<br />
									</Box>
								</Box>

								<CardBody>
									<Stack
										divider={<StackDivider />}
										spacing="4"
									>
										<Box>Business Contact</Box>

										<Box>Need Help</Box>

										<Box>Help Center</Box>

										<Box>Settings</Box>
									</Stack>
								</CardBody>
							</Card>
							<Box mt={50} ml={10} color="#FF4081" fontSize={14}>
								Logout
							</Box>
						</MenuList>
					</Menu>
				</Flex>
			</HStack>
		</Flex>
	);
};
