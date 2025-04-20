import { Flex, Text } from "@chakra-ui/react";
import { Button, Currency, PageTitle } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AccountStatementTable } from ".";

/**
 * A AccountStatement page-component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<AccountStatement></AccountStatement>`
 */
const AccountStatement = () => {
	const router = useRouter();
	const [accountStatementData, setAccountStatementData] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const { accessToken } = useSession();
	const { mobile } = router.query;

	/* API CALLING */

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents/transaction_history/recent_transaction?record_count=10&search_value=${mobile}`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		})
			.then((res) => {
				let _accountStatementData = res?.data ?? {};
				setAccountStatementData(_accountStatementData);
			})
			.catch((err) => {
				console.log("[Account Statement] error", err);
			})
			.finally(() => {
				setIsLoading(false);
			});

		return () => {
			setIsLoading(true);
		};
	}, [mobile]);

	const {
		recent_transaction_details: accountStatementTableData,
		agent_name,
		saving_balance,
	} = accountStatementData;
	console.log("accountStatementTableData", accountStatementTableData);

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
		<>
			<PageTitle title="Account Statement" />
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
							<Text fontWeight="semibold">{agent_name}</Text>
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
				<AccountStatementTable
					{...{ isLoading, accountStatementTableData }}
				/>
			</Flex>
		</>
	);
};

export default AccountStatement;
