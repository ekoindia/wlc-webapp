import { Flex, Text } from "@chakra-ui/react";
import { Button, Currency, Headings } from "components";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AccountStatementTable } from ".";
/**
 * A <AccountStatement> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<AccountStatement></AccountStatement>`
 */

const AccountStatement = () => {
	const router = useRouter();
	const { mobile } = router.query;

	/* API CALLING */

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/agents/transaction_history/recent_transaction?record_count=10&search_value=${mobile}`,
		"tf-req-method": "GET",
	};

	const { data, mutate /* , error, isLoading */ } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: { ...headers },
	});

	useEffect(() => {
		mutate(
			process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
			headers
		);
	}, [headers["tf-req-uri"]]);

	const acctabledata = data?.data?.recent_transaction_details ?? [];
	const actable = data?.data ?? [];
	const agentname = actable?.agent_name ?? [];
	const saving_balance = actable?.saving_balance ?? [];

	/*redirect to detiled statement*/
	const handleClick = () => {
		router.push({
			pathname:
				"/admin/transaction-history/account-statement/detailed-statement",
			query: { mobile },
		});
	};

	/*current date*/
	const current = new Date();
	const date = `${current.getDate()}/${
		current.getMonth() + 1
	}/${current.getFullYear()}`;

	return (
		<div>
			<Headings title="Account Statement" />
			<Flex direction="column" gap="4" mx={{ base: "4", md: "0" }}>
				<Flex
					direction="column"
					borderRadius="10"
					bg="white"
					p="4"
					fontSize="sm"
					gap="4"
				>
					<Flex
						direction={{ base: "column", md: "row" }}
						justify="space-between"
					>
						<Text fontWeight="semibold" color="light">
							Account information
						</Text>
						<Text color="primary.DEFAULT" fontSize="xs">
							as on {date}
						</Text>
					</Flex>

					<Flex
						direction={{ base: "column", md: "row" }}
						align={{ base: "flex-start", md: "center" }}
						justify="space-between"
						gap="4"
					>
						<div>
							<Text color="light">Account Holder</Text>
							<Text fontWeight="semibold">{agentname}</Text>
						</div>

						<Flex
							direction={{ base: "column", md: "row" }}
							align={{ base: "flex-start", md: "center" }}
							gap="6"
						>
							<div>
								<Text color="light">Current Balance</Text>
								<Flex
									color="primary.DEFAULT"
									fontWeight="semibold"
								>
									<Currency amount={saving_balance} />
								</Flex>
							</div>

							<Button size="md" h="56px" onClick={handleClick}>
								View Detailed Statement
							</Button>
						</Flex>
					</Flex>
				</Flex>
				<AccountStatementTable acctabledata={acctabledata} />
			</Flex>
		</div>
	);
};

export default AccountStatement;
