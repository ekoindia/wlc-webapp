import {
	Avatar,
	Box,
	Divider,
	Flex,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import {
	Button,
	Card,
	CopyButton,
	Currency,
	IcoButton,
	Icon,
} from "components";
import {
	useNetworkUsers,
	useOrgDetailContext,
	useSession,
	useUser,
} from "contexts";
import { useUserTypes } from "hooks";
import { useRouter } from "next/router";
import { blobToImageSrc } from "utils/fileUtils";
import { capitalize } from "utils/textFormat";

/**
 * AgentHierarchy component displays a vertical timeline showing the agent's
 * hierarchy from top-level parents down to the current agent.
 * @param {object} props - Component props
 * @param {Array} props.parents - Array of parent agents in the hierarchy
 * @param {string} props.currentAgentName - Name of the current agent
 * @param {Function} props.getUserCodeLabel - Function to get user code label by type ID
 * @returns {JSX.Element|null} The hierarchy component or null if no parents
 */
const AgentHierarchy = ({ parents, currentAgentName, getUserCodeLabel }) => {
	if (!parents || parents.length === 0) {
		return null;
	}

	return (
		<Box>
			<Text color="light" fontSize="xs" mb="2" fontWeight="medium">
				Hierarchy
			</Text>
			<Box
				maxH="100px"
				overflowY="auto"
				overflowX="hidden"
				pr="1"
				sx={{
					"&::-webkit-scrollbar": { width: "4px" },
					"&::-webkit-scrollbar-thumb": {
						bg: "gray.300",
						borderRadius: "full",
					},
				}}
			>
				<Box position="relative">
					{/* Vertical connector line */}
					<Box
						position="absolute"
						left="11px"
						top="0"
						bottom="0"
						width="2px"
						bg="gray.200"
						zIndex={0}
					/>

					<Flex direction="column" gap="0">
						{/* Parent nodes */}
						{parents
							.slice()
							.reverse()
							.map((parent, index) => (
								<Flex
									key={parent.user_code}
									align="center"
									gap="3"
									position="relative"
									zIndex={1}
									pb="3"
								>
									{/* Node dot */}
									<Flex
										align="center"
										justify="center"
										minW="24px"
										h="24px"
										borderRadius="full"
										bg="gray.100"
										border="2px solid"
										borderColor="gray.300"
										flexShrink={0}
									>
										<Box
											w="8px"
											h="8px"
											borderRadius="full"
											bg="gray.400"
										/>
									</Flex>

									{/* Parent info */}
									<Flex
										flex="1"
										align="center"
										gap="2"
										p="2"
										px="3"
										bg="gray.50"
										borderRadius="md"
										fontSize="sm"
										borderLeft="3px solid"
										borderColor="gray.200"
										minW="0"
										flexWrap="wrap"
									>
										<Text
											fontWeight="medium"
											color="dark"
											noOfLines={1}
										>
											{capitalize(parent.name)}
										</Text>
										<Text
											fontSize="2xs"
											color="gray.500"
											bg="gray.100"
											px="1.5"
											borderRadius="full"
											flexShrink={0}
										>
											L{index + 1}
										</Text>
										<Flex
											align="center"
											gap="1"
											color="light"
											fontSize="xs"
										>
											<Text
												color="gray.400"
												flexShrink={0}
											>
												|
											</Text>
											<Text flexShrink={0} noOfLines={1}>
												{getUserCodeLabel(
													parent.user_type_id ?? 0
												)}
												:
											</Text>
											<Text
												color="accent.DEFAULT"
												fontWeight="medium"
												noOfLines={1}
											>
												{parent.user_code}
											</Text>
											<CopyButton
												text={parent.user_code}
												size="xs"
											/>
										</Flex>
									</Flex>
								</Flex>
							))}

						{/* Current User (highlighted node) */}
						<Flex
							align="center"
							gap="3"
							position="relative"
							zIndex={1}
						>
							{/* Active dot */}
							<Flex
								align="center"
								justify="center"
								minW="24px"
								h="24px"
								borderRadius="full"
								bg="accent.50"
								border="2px solid"
								borderColor="accent.DEFAULT"
								flexShrink={0}
							>
								<Box
									w="8px"
									h="8px"
									borderRadius="full"
									bg="accent.DEFAULT"
								/>
							</Flex>

							{/* Current user info */}
							<Flex
								flex="1"
								align="center"
								gap="2"
								p="2"
								px="3"
								bg="accent.50"
								borderRadius="md"
								fontSize="sm"
								border="1px solid"
								borderColor="accent.200"
								borderLeft="3px solid"
								borderLeftColor="accent.DEFAULT"
								minW="0"
								flexWrap="wrap"
							>
								<Text
									fontWeight="semibold"
									color="dark"
									noOfLines={1}
								>
									{capitalize(currentAgentName)}
								</Text>
								<Text
									fontSize="2xs"
									color="accent.DEFAULT"
									bg="accent.100"
									px="1.5"
									borderRadius="full"
									fontWeight="medium"
									flexShrink={0}
								>
									Current
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</Box>
			</Box>
		</Box>
	);
};

/**
 * CompanyPane component displays core agent information including
 * profile avatar, hierarchy, account status, and wallet balance.
 * @param {object} props - Component props
 * @param {object} props.data - Agent data object
 * @returns {JSX.Element} The CompanyPane component
 */
const CompanyPane = ({ data }) => {
	const router = useRouter();
	const { mobile } = router.query ?? {};
	const { isAdmin } = useSession();
	const {
		agent_name,
		eko_code,
		agent_type,
		plan_name,
		wallet_balance,
		account_status,
		docs,
	} = data ?? {};

	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail ?? {};
	const { login_meta } = metadata ?? {};
	const isMobileMappedUserId = login_meta?.mobile_mapped_user_id === 1;
	const userIdLabel = login_meta?.user_id_label ?? "User ID";

	const { customer_photo } = docs ?? {};
	const avatarSrc = customer_photo
		? blobToImageSrc(customer_photo)
		: undefined;

	const { getUserCodeLabel, getUserTypeLabel } = useUserTypes();
	const { getParents } = useNetworkUsers();
	const { userData } = useUser();
	const loggedInUserCode = userData?.userDetails?.code;

	// console.log("[CompanyPane] loggedInUserCode", loggedInUserCode);

	const userCodeLabel = getUserCodeLabel(data?.user_type_id ?? 0);
	const userTypeLabel = data?.user_type_id
		? getUserTypeLabel(data?.user_type_id)
		: agent_type;

	// Get parents and filter hierarchy based on who is viewing:
	// - Own profile: show one level above the logged-in user
	// - Other's profile: logged-in user is the topmost node
	const allParents = getParents(eko_code);
	const isOwnProfile = eko_code === loggedInUserCode;
	const loggedInUserIndex = loggedInUserCode
		? allParents.findIndex((p) => p.user_code === loggedInUserCode)
		: -1;
	const parents =
		loggedInUserIndex >= 0
			? allParents.slice(0, loggedInUserIndex + (isOwnProfile ? 2 : 1))
			: allParents;

	const onViewAllTrxnClick = () => {
		router.push(`/admin/network-statement?agent_mobile=${mobile}`);
	};

	const companyDataList = [
		{ id: 1, label: "Account Status", value: account_status },
		{ id: 2, label: "Type", value: userTypeLabel },
		{ id: 3, label: "Plan", value: plan_name },
	];

	if (isMobileMappedUserId) {
		companyDataList.push({
			id: 5,
			label: userIdLabel,
			value: data?.user_id,
			enableCopy: true,
		});
	}

	return (
		<Card h={{ base: "auto", md: "560px" }} gap="8">
			<Flex direction="column" gap="8">
				<Flex gap="5" align="center">
					<Avatar
						size={{ base: "lg", md: "xl" }}
						src={avatarSrc ? avatarSrc : undefined}
						icon={avatarSrc ? undefined : <Icon name="person" />}
						showBorder={true}
						borderColor="divider"
					/>
					<div>
						<Text as="b" fontSize="xl">
							{capitalize(agent_name)}
						</Text>
						<Flex
							align="center"
							color="light"
							fontSize="sm"
							gap="1"
						>
							<Text>{userCodeLabel}:</Text>
							<Text fontWeight="medium" color="accent.DEFAULT">
								{eko_code}
							</Text>
							<CopyButton text={eko_code} size="xs" />
						</Flex>
					</div>
				</Flex>
				<Stack
					direction={{ base: "column", md: "row" }}
					divider={<StackDivider />}
					gap="2"
				>
					{companyDataList.map(
						(item) =>
							item.value && (
								<Flex
									key={item.id}
									align={{
										base: "center",
										md: "flex-start",
									}}
									direction={{
										base: "row",
										md: "column",
									}}
								>
									<Text
										color="light"
										fontSize={{ base: "xs" }}
									>
										{item.label}
										<Box
											as="span"
											display={{
												base: "initial",
												md: "none",
											}}
										>
											&#58;&nbsp;
										</Box>
									</Text>
									<Flex
										direction="row"
										align="center"
										gap="2"
									>
										<Text
											color="dark"
											fontSize="sm"
											fontWeight="medium"
										>
											{item.value}
										</Text>
										{item.enableCopy ? (
											<CopyButton
												text={item.value}
												size="xs"
											/>
										) : null}
									</Flex>
								</Flex>
							)
					)}
				</Stack>

				{/* Hierarchy - Vertical Timeline */}
				<AgentHierarchy
					parents={parents}
					currentAgentName={agent_name}
					getUserCodeLabel={getUserCodeLabel}
				/>
			</Flex>

			<Flex
				direction="column"
				p="20px"
				border="1px solid var(--chakra-colors-hint)"
				borderRadius="10px"
				bg="#FAFDFF"
				gap="4"
				fontSize="sm"
				mt="auto"
			>
				<Flex justify="space-between" align="center" py="2">
					<Flex gap="4" align="center" justify="center">
						<IcoButton
							iconName="account-balance-wallet"
							color="dark"
							size="md"
						/>
						<div>
							<Text color="light">E-value Balance</Text>
							<Currency
								amount={wallet_balance}
								fontSize="xl"
								fontWeight="medium"
								color="primary.DEFAULT"
							/>
						</div>
					</Flex>
				</Flex>
				{isAdmin ? (
					<>
						<Divider />
						<Flex align="center" justify="center">
							<Button
								variant="link"
								color="accent.DEFAULT"
								gap="1"
								_hover={{ textDecoration: "none" }}
								onClick={onViewAllTrxnClick}
							>
								View All Transactions
								<Icon name="arrow-forward" size="16px" />
							</Button>
						</Flex>
					</>
				) : null}
			</Flex>
		</Card>
	);
};

export default CompanyPane;
