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
import { useOrgDetailContext, useSession } from "contexts";
import { useUserTypes } from "hooks";
import { useRouter } from "next/router";
import { capitalize } from "utils/textFormat";

/**
 * A <CompanyPane> component that displays user/company details.
 * For example, used to show user details of My Network page in Admin panel.
 * TODO: Update misleading component name.
 *
 * This component receives a data object as a prop and displays the company's avatar, name, user code, account type, plan name, and wallet balance. It also provides a button to view all transactions.
 * @param {object} props - Properties passed to the component
 * @param {object} props.data - The data object containing company details
 * @param {string} props.data.agent_name - The name of the agent
 * @param {string} props.data.eko_code - The user code of the agent
 * @param {string} props.data.src - The source URL for the avatar image
 * @param {string} props.data.agent_type - The type of the agent's account
 * @param {string} props.data.plan_name - The name of the agent's plan
 * @param {number} props.data.wallet_balance - The balance of the agent's wallet
 * @example
 * const data = {
 *   agent_name: 'John Doe',
 *   eko_code: '1234',
 *   src: 'https://example.com/avatar.jpg',
 *   agent_type: 'Premium',
 *   plan_name: 'Gold Plan',
 *   wallet_balance: 5000
 * };
 *
 * <CompanyPane data={data} />
 */
const CompanyPane = ({ data }) => {
	const router = useRouter();
	const { mobile } = router.query ?? {};
	const { isAdmin } = useSession();
	const { agent_name, eko_code, src, agent_type, plan_name, wallet_balance } =
		data ?? {};

	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail ?? {};
	const { login_meta } = metadata ?? {};
	const isMobileMappedUserId = login_meta?.mobile_mapped_user_id === 1;
	const userIdLabel = login_meta?.user_id_label ?? "User ID";

	const { getUserCodeLabel, getUserTypeLabel } = useUserTypes();
	const userCodeLabel = getUserCodeLabel(data?.user_type_id ?? 0);
	const userTypeLabel = data?.user_type_id
		? getUserTypeLabel(data?.user_type_id)
		: agent_type;

	const onViewAllTrxnClick = () => {
		router.push(`/admin/network-statement?agent_mobile=${mobile}`);
	};

	const companyDataList = [
		{ id: 1, label: "Type", value: userTypeLabel },
		{ id: 2, label: "Plan", value: plan_name },
		// { id: 3, label: "KYC status", value: "KYC Compliant" },
	];

	if (isMobileMappedUserId) {
		companyDataList.push({
			id: 4,
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
						icon={<Icon name="person" />}
						src={src}
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
												base: "inital",
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
