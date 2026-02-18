import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { useWallet } from "contexts/WalletContext";
import { fetcher } from "helpers";
import { WidgetBase } from "page-components/Home";
import { useEffect, useState } from "react";

/**
 * A AccountSummary page-component
 */
const AccountSummary = () => {
	const { accessToken } = useSession();
	const { accountList } = useWallet();

	const [gstin, setGstin] = useState("");

	// Fetch user's GSTIN
	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			token: accessToken,
			body: {
				interaction_type_id: 373, // Get GSTIN Details
			},
			controller: undefined,
		})
			.then((res) => {
				if (res?.data?.gstin) {
					setGstin(res.data.gstin);
				}
			})
			.catch((error) => {
				console.error("[AccountSummary] Get GSTIN Error:", error);
			});
	}, []);

	const bankAccounts = accountList?.filter((acc) => acc.type_id == 3);

	// If no GSTIN and no bank accounts, don't show the widget
	if (!gstin && (!bankAccounts || bankAccounts.length === 0)) {
		return null;
	}

	return (
		<WidgetBase
			title="Account Details"
			// iconName="mode-edit"
			// linkOnClick={() => onOpen()}
		>
			{gstin ? (
				<>
					<Flex direction="column" fontSize="sm">
						<Text>GSTIN</Text>
						<Text
							fontSize="md"
							fontWeight="semibold"
							color="primary.DEFAULT"
						>
							{gstin}
						</Text>
					</Flex>
					<Divider my="14px" />
				</>
			) : null}

			{bankAccounts && bankAccounts.length > 0 ? (
				<Flex direction="column">
					<Text>Connected Bank Account(s)</Text>
					<Box
						fontSize="md"
						fontWeight="semibold"
						color="primary.DEFAULT"
					>
						<ol
							style={{
								listStyleType: "decimal",
								paddingLeft: "20px",
							}}
						>
							{accountList
								?.filter((acc) => acc.type_id == 3)
								.map((acc) => (
									<li key={acc.account_id}>
										{acc.label}{" "}
										<Text
											as="span"
											fontWeight="normal"
											fontSize="0.8em"
											color="#222"
										>
											(A/c: {acc.account_number})
										</Text>
									</li>
								))}
						</ol>
					</Box>
				</Flex>
			) : null}
		</WidgetBase>
	);
};

export { AccountSummary };
