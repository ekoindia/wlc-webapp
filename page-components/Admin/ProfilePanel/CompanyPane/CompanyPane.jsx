import {
	Avatar,
	Box,
	Divider,
	Flex,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { Button, Card, Currency, IcoButton, Icon } from "components";
import { useRouter } from "next/router";
/**
 * A <CompanyPane> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<CompanyPane></CompanyPane>`
 */
const CompanyPane = ({ data }) => {
	const router = useRouter();
	const { mobile } = router.query;
	const handleclick = () => {
		router.push(
			`/admin/transaction-history/account-statement/detailed-statement?mobile=${mobile}`
		);
	};

	const companyDataList = [
		{ id: 1, label: "Account Type", value: data?.account_type },
		{ id: 2, label: "Plan name", value: data?.plan_name },
		// { id: 3, label: "KYC status", value: "KYC Compliant" },
	];

	return (
		<Card h={{ base: "auto", md: "560px" }} gap="8">
			<Flex direction="column" gap="8">
				<Flex gap="5" align="center">
					<Avatar
						size={{ base: "lg", md: "xl" }}
						icon={<Icon name="person" />}
						src={data?.src}
						showBorder={true}
						borderColor="divider"
					/>
					<div>
						<Text as="b" fontSize="xl">
							{data?.agent_name}
						</Text>
						<Flex gap="1" color="light" fontSize="sm">
							User Code:
							<Text fontWeight="medium" color="accent.DEFAULT">
								{data?.eko_code}
							</Text>
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
									<Text
										color="dark"
										fontSize="sm"
										fontWeight="medium"
									>
										{item.value}
									</Text>
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
								amount={data?.wallet_balance}
								fontSize="xl"
								fontWeight="medium"
								color="primary.DEFAULT"
							/>
						</div>
					</Flex>
				</Flex>
				<Divider />
				<Flex align="center" justify="center">
					<Button
						variant="link"
						color="accent.DEFAULT"
						gap="1"
						_hover={{ textDecoration: "none" }}
						onClick={handleclick}
					>
						View All Transactions
						<Icon name="arrow-forward" size="16px" />
					</Button>
				</Flex>
			</Flex>
		</Card>
	);
};

export default CompanyPane;
