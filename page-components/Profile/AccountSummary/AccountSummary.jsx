import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { useUser } from "contexts/UserContext";
import { useWallet } from "contexts/WalletContext";
import { WidgetBase } from "page-components/Home";

/**
 * A AccountSummary page-component
 */
const AccountSummary = () => {
	const { userData } = useUser();
	const { accountDetails } = userData || {};
	const { accountList } = useWallet();
	const bankAccounts = accountList?.filter((acc) => acc.type_id == 3);

	console.log("UserData::::: ", accountDetails);

	return (
		<WidgetBase
			title="Account Details"
			// iconName="mode-edit"
			// linkOnClick={() => onOpen()}
		>
			<Grid
				templateColumns="repeat(2, 1fr)"
				rowGap="20px"
				fontSize={{ base: "14px" }}
			>
				<GridItem colSpan={1} rowSpan={1}>
					<Flex direction="column">
						<Text>GST Number</Text>
						<Text fontWeight="semibold">
							{accountDetails?.gst || "N/A"}
						</Text>
					</Flex>
				</GridItem>

				{bankAccounts && bankAccounts.length > 0 ? (
					<GridItem colSpan={1} rowSpan={1}>
						<Flex direction="column">
							<Text>Bank Accounts</Text>
							<Box fontSize="0.8em" fontWeight="semibold">
								<ol
									style={{
										listStyleType: "decimal",
										// paddingLeft: "16px",
									}}
								>
									{accountList
										?.filter((acc) => acc.type_id == 3)
										.map((acc) => (
											<li key={acc.account_id}>
												{acc.label} (
												{acc.account_number})
											</li>
										))}
								</ol>
							</Box>
						</Flex>
					</GridItem>
				) : null}
			</Grid>
		</WidgetBase>
	);
};

export { AccountSummary };
