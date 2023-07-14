import {
	Avatar,
	Box,
	Divider,
	Flex,
	Heading,
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
const CompanyPane = ({ rowData: compdata, agent_name }) => {
	const router = useRouter();
	const { cellnumber } = router.query;
	const handleclick = () => {
		router.push(
			`/admin/transaction-history/account-statement/detailed-statement?cellnumber=${cellnumber}`
		);
	};

	const companyDataList = [
		{ id: 1, label: "Account Type", value: compdata?.account_type },
		{ id: 2, label: "Plan name", value: compdata?.plan_name },
		// { id: 3, label: "KYC status", value: "KYC Compliant" },
	];

	return (
		<Card>
			<Flex gap="5" align="center">
				<Avatar
					w={{ base: 16, lg: 59, xl: 90 }}
					h={{ base: 16, lg: 59, xl: 90 }}
					icon={<Icon name="person" />}
					src={compdata?.src}
					showBorder={true}
				/>
				<Box>
					<Heading
						fontSize={{ base: 20, md: 15, lg: 17, xl: 18 }}
						fontWeight="semibold"
					>
						{agent_name}
					</Heading>
					<Flex
						fontSize={{ base: 14, md: 12, lg: 14 }}
						fontWeight="medium"
					>
						<Text>User Code:</Text>
						<Text color={"primary.DEFAULT"}>
							&nbsp; {compdata?.eko_code}
						</Text>
					</Flex>
				</Box>
			</Flex>
			<Stack
				direction={{ base: "column", md: "row" }}
				divider={<StackDivider />}
				gap={{ base: "2", md: "3" }}
				mt={{ base: "24px", xl: "48px" }}
				mb={{ base: "24px", md: "none" }}
			>
				{companyDataList.map(
					(item) =>
						item.value && (
							<Flex
								key={item.id}
								align={{ base: "center", md: "flex-start" }}
								direction={{ base: "row", md: "column" }}
							>
								<Text color="light" fontSize={{ base: "xs" }}>
									{item.label}
									<Box
										as="span"
										display={{ base: "inital", md: "none" }}
									>
										&#58;&nbsp;
									</Box>
								</Text>
								<Text
									color="dark"
									fontSize={{ base: "sm" }}
									fontWeight="medium"
								>
									{item.value}
								</Text>
							</Flex>
						)
				)}
			</Stack>
			<Box
				mt="auto"
				p="20px"
				h="160px"
				border="1px solid #D2D2D2"
				borderRadius="15px"
				bg="#FAFDFF"
			>
				<Flex justify="space-between" align="center" mb={4}>
					<Flex gap={4} align="center" justify="center">
						<IcoButton
							iconName="account-balance-wallet"
							color="dark"
							size="md"
						/>
						<Box>
							<Text color={"light"} fontSize={14}>
								E-value Balance
							</Text>
							<Currency
								amount={compdata?.wallet_balance}
								fontSize="20px"
								fontWeight="medium"
								color="accent.DEFAULT"
							/>
						</Box>
					</Flex>
				</Flex>
				<Divider />
				<Flex align="center" justify="center" mt="6">
					<Button
						variant="link"
						fontSize="sm"
						color="primary.DEFAULT"
						gap="1"
						_hover={{ textDecoration: "none" }}
						onClick={handleclick}
					>
						View All Transactions
						<Icon name="arrow-forward" size="16px" />
					</Button>
				</Flex>
			</Box>
		</Card>
	);
};

export default CompanyPane;
