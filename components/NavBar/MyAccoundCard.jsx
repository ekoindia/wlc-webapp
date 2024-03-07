import { Box, Divider, Flex, Text, Tooltip } from "@chakra-ui/react";
import { Endpoints, TransactionIds } from "constants";
import { adminProfileMenu, profileMenu } from "constants/profileCardMenus";
import { useUser } from "contexts";
import { useClipboard } from "hooks";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { clearCacheAndReload } from "utils";
import { AdminViewToggleCard, Button, IcoButton, Icon } from "..";

const MyAccountCard = ({ setIsCardOpen }) => {
	const { isAdmin, logout, isOnboarding, userData } = useUser();
	const { userDetails } = userData;
	const { name, code, email, mobile } = userDetails ?? {};
	const router = useRouter();
	const { copy, state } = useClipboard();
	const menulist = isAdmin ? adminProfileMenu : profileMenu;

	return (
		<Box
			border="card"
			boxShadow="0px 6px 10px #00000033"
			borderRadius="10px"
			w={{ base: "100%", sm: "initial" }}
		>
			<Flex
				direction="column"
				px={{ base: "3", sm: "2", md: "2", lg: "4" }}
				py={{ base: "2", sm: "2", md: "1", lg: "" }}
				w="full"
				bg="primary.DEFAULT"
				position="relative"
				borderTopRadius="10px"
			>
				<Flex
					display={{ base: "flex", sm: "none" }}
					color="white"
					justifyContent="flex-end"
					w="100%"
				>
					<Icon
						name="close"
						size="16px"
						onClick={() => setIsCardOpen(false)}
					/>
				</Flex>
				<Box
					display={{ base: "none", sm: "initial" }}
					color="primary.DEFAULT"
					transform="rotate(180deg)"
					position="absolute"
					top="-12px"
					right="14px"
				>
					<Icon name="arrow-drop-down" size="sm" />
				</Box>

				<Box w="full" py="10px" userSelect="none">
					<Flex
						w="full"
						wrap="wrap"
						justifyContent={{
							base: "space-between",
							sm: "initial",
						}}
						gap={{
							base: "20px",
							"2xl": "25px",
						}}
						lineHeight="normal"
					>
						{name ? (
							<Text
								fontSize={{
									base: "16px",
									sm: "12px",
									lg: "14px",
								}}
								color="highlight"
								textTransform="capitalize"
								whiteSpace="nowrap"
								overflow="hidden"
								textOverflow="ellipsis"
								width="40%"
								title={name || ""}
							>
								{name?.toLowerCase()}
							</Text>
						) : null}

						{code && code > 1 ? (
							<Flex
								fontSize={{ base: "xs", sm: "xxs" }}
								align="center"
								w="fit-content"
								color="white"
								gap="1"
							>
								<Text as="span">User Code:</Text>
								<Flex
									align="center"
									gap="0.5"
									cursor="pointer"
									transition="opacity 0.3s ease-out"
									_hover={{ opacity: 0.9 }}
									onClick={() => copy(code)}
								>
									<Text as="span" fontWeight="medium">
										{code}
									</Text>
									<Icon
										title="Copy"
										name={
											state[code]
												? "check"
												: "content-copy"
										}
										size="xs"
										color="white"
										transition="opacity 0.3s ease-out"
									/>
								</Flex>
							</Flex>
						) : null}
					</Flex>

					{email ? (
						<Flex
							py=".3vw"
							align="center"
							gap="0.5"
							cursor="pointer"
							transition="opacity 0.3s ease-out"
							_hover={{ opacity: 0.9 }}
							onClick={() => copy(email)}
						>
							<Text
								fontSize={{
									base: "12px",
									sm: "10px",
								}}
								w="fit-content"
								color="white"
							>
								{email}
							</Text>
							<Icon
								title="Copy"
								name={state[email] ? "check" : "content-copy"}
								color="white"
								size="xs"
							/>
						</Flex>
					) : null}

					{mobile && mobile > 1 ? (
						<Flex
							w="full"
							py="2"
							justify="space-between"
							mt={{ base: "8px", sm: "initial" }}
							wrap="wrap"
						>
							<Flex
								justify="space-between"
								align="center"
								gap={{ base: "4", sm: "2" }}
							>
								<Flex
									align="center"
									gap="0.5"
									cursor="pointer"
									transition="opacity 0.3s ease-out"
									_hover={{ opacity: 0.9 }}
									onClick={() => copy(mobile)}
								>
									<Text
										fontSize={{ base: "xs", sm: "xxs" }}
										color="white"
									>
										+91{" "}
										{mobile.slice(0, 5) +
											" " +
											mobile.slice(5)}
									</Text>
									<Icon
										title="Copy"
										name={
											state[mobile]
												? "check"
												: "content-copy"
										}
										color="white"
										size="xs"
									/>
								</Flex>
								<IcoButton
									size="xs"
									theme="accent"
									iconName="mode-edit"
									onClick={() => {
										const prefix = isAdmin ? "/admin" : "";
										router.push(
											`${prefix}/transaction/${TransactionIds.MANAGE_MY_ACCOUNT}/${TransactionIds.UPDATE_REGISTERED_MOBILE}`
										);
										if (setIsCardOpen) {
											setIsCardOpen(false);
										}
									}}
								/>
							</Flex>

							{isAdmin !== true && isOnboarding !== true && (
								<Button
									size="xs"
									icon="chevron-right"
									iconPosition="right"
									iconSpacing="2px"
									h="36px"
									fontWeight="semibold"
									borderRadius="6px"
									fontSize="12px"
									onClick={() => {
										router.push(Endpoints.USER_PROFILE);
										if (setIsCardOpen) {
											setIsCardOpen(false);
										}
									}}
								>
									View Profile
								</Button>
							)}
						</Flex>
					) : null}
				</Box>

				{isOnboarding !== true && isAdmin === true ? (
					<AdminViewToggleCard minimal />
				) : null}
			</Flex>

			<Flex
				direction="column"
				px="4"
				w="100%"
				bg="white"
				h={{ base: "100%", sm: "initial" }}
				fontSize={{ base: "sm", md: "xs" }}
				borderBottomRadius="10px"
			>
				{isOnboarding !== true
					? menulist.map((ele) => (
							<Fragment key={"mnu-" + ele.title + ele.link}>
								<Flex
									w="100%"
									h={{ base: "auto", md: "100%" }}
									align="center"
									justify="space-between"
									cursor="pointer"
									minH="50px"
									onClick={() => {
										router.push(ele.link);
										if (setIsCardOpen) {
											setIsCardOpen(false);
										}
									}}
								>
									<Text>{ele.title}</Text>
									<Icon name="chevron-right" size="xxs" />
								</Flex>
								<Divider />
							</Fragment>
					  ))
					: null}
				<Flex
					direction="row"
					minH="50px"
					w="100%"
					justify="space-between"
					cursor="pointer"
					align="center"
					color="error"
				>
					<Flex py="3" align="center" onClick={logout}>
						<Icon name="logout" size="sm" mr="2" />
						<Text fontWeight="medium">Logout</Text>
					</Flex>
					<Tooltip label="Clear Cache" placement="left" hasArrow>
						<Flex
							ml="2"
							px="3"
							py="2"
							borderLeft="1px solid"
							borderColor="divider"
							onClick={() => clearCacheAndReload(true)}
							_hover={{ bg: "gray.100" }}
						>
							<Icon
								name="reload"
								label="Clear Cache"
								size="14px"
							/>
						</Flex>
					</Tooltip>
				</Flex>
			</Flex>
		</Box>
	);
};

export default MyAccountCard;
