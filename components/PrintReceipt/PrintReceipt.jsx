import { Box, Flex, Text } from "@chakra-ui/react";
import { OrgLogo } from "components";
import { useOrgDetailContext, useUser } from "contexts";

/**
 * Show a receipt header/footer on paper when printing the page (@media print).
 * @param root0
 * @param root0.heading
 * @param root0.receiptTnc
 * @param root0.children
 * @example
 * 	<PrintReceipt>
 * 		{children}
 *  </PrintReceipt>
 */
const PrintReceipt = ({ heading, receiptTnc, children, ...rest }) => {
	const { userData, isLoggedIn } = useUser();
	const { orgDetail } = useOrgDetailContext();

	const tnc =
		receiptTnc ??
		orgDetail?.metadata?.tnc ??
		`${orgDetail.app_name} at no such point of time has any right, title or interest over the contract for sale of any of the products or services between the Retailer and the Buyer nor shall ${orgDetail.app_name} have any obligation or liabilities in respect of such contract.`;

	if (!isLoggedIn) {
		return <>{children}</>;
	}

	return (
		<>
			{/* Header */}
			<Flex
				display="none"
				sx={{
					"@media print": {
						display: "flex",
					},
				}}
				flexDirection="column"
				className="printhead"
				width="100%"
				{...rest}
			>
				<Flex flexDirection="row" align="center" width="100%">
					{orgDetail.logo && (
						<OrgLogo
							size="lg"
							// size={{ base: "md", md: "lg" }}
							// mr={8}
							mr={3}
							sx={{
								"@media print and (max-width:5in)": {
									marginRight: 2,
								},
								"@media print and (max-width:2.5in)": {
									display: "none",
								},
							}}
						/>
					)}
					<Box flexGrow={1} />
					<Flex
						flexDirection="column"
						className="shop flex"
						textAlign="right"
					>
						<Text
							fontSize={{ base: "1.05em", lg: "1.4em" }}
							noOfLines={1}
						>
							{userData?.userDetails?.shop_name}
						</Text>
						<Text
							fontSize={{ base: "0.6em", lg: "0.7em" }}
							noOfLines={2}
							maxW="300px"
						>
							{userData?.userDetails?.agent_shop_address}
						</Text>
					</Flex>
				</Flex>
				{heading ? (
					<Text
						as="div"
						fontSize="xs"
						noOfLines={1}
						py="5px"
						my="10px"
						border="1px solid #ccc"
						borderX={0}
						textAlign="center"
					>
						{heading}
					</Text>
				) : null}
			</Flex>
			{children}
			{/* Footer */}
			<Flex
				display="none"
				sx={{
					"@media print": {
						display: "flex",
					},
				}}
				flexDirection="column"
				width="100%"
			>
				{orgDetail.org_name ? (
					<Text fontSize="0.7em" mt="1em">
						Provided by <strong>{orgDetail.org_name}</strong>
					</Text>
				) : null}
				{tnc ? (
					<Text fontSize="0.5em" fontStyle="italic" mt="1em">
						<sup>✢</sup>&nbsp;{tnc}
					</Text>
				) : null}
			</Flex>
		</>
	);
};

export default PrintReceipt;
