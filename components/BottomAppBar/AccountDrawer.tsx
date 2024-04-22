import {
	Avatar,
	Box,
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Text,
	useDisclosure,
	useToken,
} from "@chakra-ui/react";
import { TransactionIds } from "constants/EpsTransactions";
import { useUser } from "contexts/UserContext";
import useClipboard from "hooks/useClipboard";
import Link from "next/link";
import { useRef } from "react";
import { clearCacheAndReload } from "utils/cacheUtils";
import { svgBgDotted } from "utils/svgPatterns";
import { AdminViewToggleCard, IcoButton, Icon, StatusCard } from "..";

/**
 * Formats a mobile number by adding a country code and a space at the middle of the number.
 * @param {string} mobile - The mobile number to format.
 * @param {string} countryCode - The country code to add to the mobile number.
 * @returns {string} The formatted mobile number.
 */
const formatMobileNumber = (mobile, countryCode = "+91") => {
	if (!mobile) return "";
	const mid = Math.floor(mobile.length / 2);
	return `${countryCode} ${mobile.slice(0, mid)} ${mobile.slice(mid)}`;
};

const AccountDrawer = () => {
	const btnRef = useRef<HTMLButtonElement>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<DrawerContainer {...{ isOpen, onOpen, onClose, btnRef }}>
			<Flex direction="column" w="100%" gap="4" bg="bg" pb="4">
				<AccountCard />
				<Flex direction="column" px="4" gap="4">
					<InfoCard />
					<LinkCard />
					{/* <MenuCard /> */}
					<AppOption />
				</Flex>
				<Flex align="center" justify="center" py="4">
					<Link href="/privacy">
						<Flex gap="1" fontWeight="medium">
							<Text fontSize="xs" lineHeight="1">
								Privacy Policy
							</Text>
							<Icon name="open-in-new" size="xs" />
						</Flex>
					</Link>
				</Flex>
			</Flex>
		</DrawerContainer>
	);
};

export default AccountDrawer;

const DrawerContainer = ({ isOpen, onOpen, onClose, btnRef, children }) => {
	const { userData } = useUser();
	const { userDetails } = userData;
	const { name, pic } = userDetails ?? {};
	return (
		<>
			<Flex
				direction="column"
				gap="1"
				w="100%"
				h="100%"
				align="center"
				justify="center"
				onClick={onOpen}
			>
				<Avatar
					name={name ? name[0] : ""}
					src={pic}
					size="xs"
					bg="primary.dark"
					w="18px"
					h="18px"
				/>
				<Text fontSize="10px" fontWeight="medium" noOfLines={2}>
					You
				</Text>
			</Flex>
			<Drawer
				isOpen={isOpen}
				placement="bottom"
				onClose={onClose}
				finalFocusRef={btnRef}
				// isFullHeight={true}
			>
				<DrawerOverlay />
				<DrawerContent
					w="100%"
					h="100%"
					borderTopRadius="10px"
					// pb="22px"
				>
					<DrawerHeader onClose={onClose} />
					<Divider />
					<Flex
						// className="customScrollbars"
						direction="column"
						overflowY="scroll"
						gap="2"
					>
						{children}
					</Flex>
				</DrawerContent>
			</Drawer>
		</>
	);
};

const DrawerHeader = ({ onClose }) => {
	const [contrast_color] = useToken("colors", ["navbar.dark"]);
	return (
		<Flex
			w="100%"
			minH="56px"
			align="center"
			justify="space-between"
			px="5"
			backgroundImage={svgBgDotted({
				fill: contrast_color,
				opacity: 0.04,
			})}
		>
			<Text fontSize="lg" fontWeight="semibold">
				Account
			</Text>
			<Flex direction="row-reverse" onClick={onClose} w="20%">
				<Icon
					size="xs"
					name="close"
					color="light"
					_active={{ color: "error" }}
				/>
			</Flex>
		</Flex>
	);
};

/**
 * AccountCard component
 * This component displays the account details of the user.
 * It includes the user's avatar, name, mobile number, status card, and admin view toggle card.
 */
const AccountCard = () => {
	const [contrastColor] = useToken("colors", ["navbar.dark"]);
	const { userData, isAdmin } = useUser();
	const { name, pic } = userData?.userDetails ?? {};

	const cards = [
		{ Component: StatusCard, visible: true },
		{ Component: AdminViewToggleCard, visible: isAdmin },
	];

	return (
		<Flex
			direction="column"
			gap="4"
			p="4"
			borderBottomRadius="10px"
			boxShadow="buttonShadow"
			bg="white"
			backgroundImage={svgBgDotted({
				fill: contrastColor,
				opacity: 0.04,
			})}
		>
			<Flex align="center" justify="space-between">
				<Flex align="center" gap="3">
					<Avatar
						name={name ? name[0] : ""}
						src={pic}
						h="56px"
						w="56px"
						bg="primary.dark"
					/>
					<Flex direction="column">
						<Text fontSize="md" fontWeight="medium" noOfLines={2}>
							{name}
						</Text>
					</Flex>
				</Flex>
				<Link
					href={
						isAdmin
							? `/admin/transaction/${TransactionIds.MANAGE_MY_ACCOUNT}`
							: `/transaction/${TransactionIds.MANAGE_MY_ACCOUNT}`
					}
				>
					<IcoButton
						iconName="mode-edit"
						size="sm"
						boxShadow="buttonShadow"
					/>
				</Link>
			</Flex>
			{cards.map(
				(card, index) =>
					card.visible && (
						<Box
							key={index}
							bgGradient="linear(to-r, primary.dark, primary.light)"
							borderRadius="10px"
						>
							<card.Component
								borderRadius="10px"
								marginBottom="0px"
								border="none"
								bg="inherit"
							/>
						</Box>
					)
			)}
		</Flex>
	);
};

const InfoCard = () => {
	const { copy, state } = useClipboard();
	const { userData } = useUser();
	const { code, mobile, email } = userData?.userDetails ?? {};

	const userInfo = [
		{
			label: "Mobile",
			value: mobile,
			decoratedValue: formatMobileNumber(mobile),
			onClick: () => copy(mobile),
		},
		{
			label: "Email",
			value: email,
			onClick: () => copy(email),
		},
		{
			label: "User Code",
			value: code,
			onClick: () => copy(code),
		},
	];

	return (
		<Flex direction="column" gap="2" p="4" bg="white" borderRadius="10px">
			{userInfo.map(
				({ label, value, decoratedValue, onClick }, index) => (
					<>
						<Flex
							key={index}
							align="center"
							gap="0.5"
							cursor="pointer"
							onClick={onClick}
						>
							<Flex fontSize="sm" gap="1">
								<Text color="light">{label}: </Text>
								<Text fontWeight="medium" color="dark">
									{decoratedValue?.length
										? decoratedValue
										: value}
								</Text>
							</Flex>

							<Icon
								title="Copy"
								name={state[value] ? "check" : "content-copy"}
								size="xs"
								color="light"
								transition="opacity 0.3s ease-out"
							/>
						</Flex>
						{userInfo?.length - 1 !== index && <Divider />}
					</>
				)
			)}
		</Flex>
	);
};

const LinkCard = () => {
	const { isAdmin } = useUser();
	const links = [
		{ label: "View Profile", href: "/profile", visible: !isAdmin },
		{
			label: "View Transaction History",
			href: isAdmin ? "/admin/history" : "/history",
			visible: true,
		},
	];

	return (
		<Flex direction="column" gap="2" p="4" bg="white" borderRadius="10px">
			{links.map(
				({ label, href, visible }, index) =>
					visible && (
						<>
							<Link href={href}>
								<Flex align="center" justify="space-between">
									<Text
										fontSize="sm"
										fontWeight="medium"
										color="primary.dark"
									>
										{label}
									</Text>

									<Icon
										name="chevron-right"
										size="xs"
										color="light"
									/>
								</Flex>
							</Link>
							{links?.length - 1 !== index && <Divider />}
						</>
					)
			)}
		</Flex>
	);
};

const AppOption = () => {
	const { logout } = useUser();

	const options = [
		{ label: "Sign Out", onClick: logout },
		{ label: "Reset", onClick: () => clearCacheAndReload() },
	];

	return (
		<Flex direction="column" gap="2" p="4" bg="white" borderRadius="10px">
			{options.map(({ label, onClick }, index) => {
				return (
					<>
						<Flex
							key={index}
							align="center"
							justify="space-between"
							onClick={onClick}
						>
							<Text
								fontSize="sm"
								fontWeight="medium"
								color="primary.dark"
							>
								{label}
							</Text>
							<Icon
								name="chevron-right"
								size="xs"
								color="light"
							/>
						</Flex>
						{options?.length - 1 !== index && <Divider />}
					</>
				);
			})}
		</Flex>
	);
};

// const MenuCard = () => {
// 	const { isAdmin } = useUser();
// 	const { menuList, otherList } = useNavigationLists();
// 	return (
// 		<Flex direction="column" gap="4">
// 			<Flex
// 				direction="column"
// 				gap="4"
// 				p="4"
// 				bg="white"
// 				borderRadius="10px"
// 			>
// 				{menuList?.map((item, index) => {
// 					const key = `menu-${item.label}-${index}`;

// 					return (
// 						<>
// 							<Link href={item.link} key={key}>
// 								<Flex align="center" justify="space-between">
// 									<Text
// 										fontSize="sm"
// 										fontWeight="medium"
// 										color="primary.dark"
// 									>
// 										{item.label}
// 									</Text>
// 									<Icon
// 										name="chevron-right"
// 										size="xs"
// 										color="light"
// 									/>
// 								</Flex>
// 							</Link>
// 							{menuList?.length - 1 !== index && <Divider />}
// 						</>
// 					);
// 				})}
// 			</Flex>
// 			<Flex
// 				direction="column"
// 				gap="4"
// 				p="4"
// 				bg="white"
// 				borderRadius="10px"
// 			>
// 				{otherList?.map((item, index) => {
// 					const link =
// 						item?.link ||
// 						`${isAdmin ? "/admin" : ""}/transaction/${item?.id}`;

// 					const key = `other-${item.label}-${index}`;

// 					return (
// 						<>
// 							<Link href={link} key={key}>
// 								<Flex align="center" justify="space-between">
// 									<Text
// 										fontSize="sm"
// 										fontWeight="medium"
// 										color="primary.dark"
// 									>
// 										{item.label}
// 									</Text>
// 									<Icon
// 										name="chevron-right"
// 										size="xs"
// 										color="light"
// 									/>
// 								</Flex>
// 							</Link>
// 							{otherList?.length - 1 !== index && <Divider />}
// 						</>
// 					);
// 				})}
// 			</Flex>
// 		</Flex>
// 	);
// };
