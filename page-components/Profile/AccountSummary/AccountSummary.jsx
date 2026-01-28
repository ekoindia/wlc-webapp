import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useUser } from "contexts/UserContext";
import { useWallet } from "contexts/WalletContext";
import { WidgetBase } from "page-components/Home";

/**
 * A AccountSummary page-component
 */
const AccountSummary = () => {
	const { userData, isAdmin } = useUser();
	const { accountDetails } = userData || {};
	const { accountList } = useWallet();
	const bankAccounts = accountList?.filter((acc) => acc.type_id == 3);

	// TODO: Allow for Non-Admins as well
	if (!isAdmin) {
		return null;
	}

	return (
		<WidgetBase
			title="Account Details"
			// iconName="mode-edit"
			// linkOnClick={() => onOpen()}
		>
			<Flex direction="column" fontSize="sm">
				<Text>GSTIN</Text>
				<Text
					fontSize="md"
					fontWeight="semibold"
					color="primary.DEFAULT"
				>
					{accountDetails?.gst || "N/A"}
				</Text>
			</Flex>

			<Divider my="14px" />

			{bankAccounts && bankAccounts.length > 0 ? (
				<Flex direction="column">
					<Text>Connected Bank Accounts</Text>
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
