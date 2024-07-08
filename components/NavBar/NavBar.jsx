import {
	Avatar,
	Box,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuList,
	Text,
	useBreakpointValue,
	useDisclosure,
	useToken,
} from "@chakra-ui/react";
import { useKBarReady } from "components/CommandBar";
import { useOrgDetailContext, useUser } from "contexts";
import dynamic from "next/dynamic";
import { useState } from "react";
import { limitText } from "utils";
import { svgBgDotted } from "utils/svgPatterns";
import { MyAccountCard } from ".";
import { Icon, OrgLogo } from "..";

export const NavHeight = {
	base: "56px",
	md: "50px",
	lg: "60px",
	"2xl": "90px",
};

/**
 * The top app-bar component
 */
const NavBar = () => {
	const [, setIsCardOpen] = useState(false);

	return (
		<>
			<Box as="nav" w="full" h={NavHeight}></Box>
			<Box
				as="section"
				top="0%"
				w="full"
				position="fixed"
				zIndex="99"
				boxShadow="0px 3px 10px #0000001A"
			>
				<Box as="nav" position="sticky" w="full" h={NavHeight}>
					<NavContent {...{ setIsCardOpen }} />
				</Box>
			</Box>
		</>
	);
};

export default NavBar;

const NavContent = ({ setIsCardOpen }) => {
	const { userData, isAdmin, isAdminAgentMode, isOnboarding, isLoggedIn } =
		useUser();
	const { userDetails } = userData;
	const { name, pic } = userDetails ?? {};
	const { orgDetail } = useOrgDetailContext();
	// const router = useRouter();
	const isMobile = useBreakpointValue({ base: true, md: false });

	// Check if CommandBar is loaded...
	const { ready } = useKBarReady();

	// Get theme color values
	const [contrast_color] = useToken("colors", ["navbar.dark"]);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const GlobalSearch = dynamic(() => import("../GlobalSearch/GlobalSearch"), {
		ssr: false,
		loading: () => (
			<Box
				ml={1}
				w={{
					base: "auto",
					md: "280px",
					lg: "400px",
					xl: "500px",
				}}
				h="36px"
				radius={6}
				bg="shade"
			/>
		),
	});

	return (
		<HStack
			bg="navbar.bg"
			h="full"
			justifyContent="space-between"
			px={{ base: "4", xl: "6" }}
			backgroundImage={svgBgDotted({
				fill: contrast_color,
				opacity: 0.04,
			})}
		>
			{/* Left-side items of navbar */}
			<Flex align="center" flexGrow={isMobile ? 1 : 0}>
				<OrgLogo
					size="md"
					align="center"
					dark={orgDetail?.metadata?.theme?.navstyle === "light"}
					minW={{ base: "auto", md: "250px" }}
				/>

				{!isMobile &&
					ready &&
					isLoggedIn === true &&
					isOnboarding !== true && (
						<Flex justify="flex-start">
							<GlobalSearch />
						</Flex>
					)}
			</Flex>

			{/* Right-side items of navbar */}
			<Menu defaultIsOpen={false} isOpen={isOpen} onClose={onClose}>
				<MenuButton
					onClick={() => {
						onOpen();
						setIsCardOpen(true);
					}}
				>
					<Flex align="center" cursor="pointer" zIndex="10">
						<Box bg="navbar.bgAlt" padding="2px" borderRadius="50%">
							<Avatar
								w={{
									base: "34px",
									xl: "38px",
									"2xl": "42px",
								}}
								h={{
									base: "34px",
									xl: "38px",
									"2xl": "42px",
								}}
								name={name ? name[0] : ""}
								lineHeight="3px"
								src={pic}
							/>
						</Box>
						{isAdmin ? (
							<Flex
								ml="0.5vw"
								h="2.3vw"
								justify="center"
								direction="column"
								display={{ base: "none", md: "flex" }}
								lineHeight={{
									base: "15px",
									lg: "16px",
									xl: "18px",
									"2xl": "22px",
								}}
							>
								<Flex align="center">
									<Text
										as="span"
										fontSize={{
											base: "12px",
											"2xl": "16px",
										}}
										fontWeight="semibold"
										mr="1.6vw"
										color="navbar.text"
									>
										{limitText(name || "", 12)}
									</Text>

									<Icon
										name="arrow-drop-down"
										size="xs"
										mt="2px"
										color="navbar.text"
									/>
								</Flex>
								<Text
									fontSize={{
										base: "10px",
										"2xl": "14px",
									}}
									color="navbar.textLight"
									textAlign="start"
								>
									{isAdminAgentMode
										? "Viewing as Agent"
										: "Logged in as Admin"}
								</Text>
							</Flex>
						) : null}
					</Flex>
				</MenuButton>

				<MenuList
					w={{
						base: "320px",
						sm: "320px",
						"2xl": "349px",
					}}
					border="none"
					bg="transparent"
					boxShadow="none"
					borderRadius="0px"
					p="0px"
					mr={{
						base: "-0.9vw",
						lg: "-0.6vw",
					}}
				>
					<MyAccountCard {...{ setIsCardOpen, onClose }} />
				</MenuList>
			</Menu>
		</HStack>
	);
};
