import { Flex, Text } from "@chakra-ui/react";
import { OrgLogo } from "components";
import { useOrgDetailContext, useUser } from "contexts";

/**
 * Show a receipt header/footer on paper when printing the page (@media print).
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
		`${orgDetail.app_name} at no such point of time has any right, title or interest over the contract for sale of any of the products or services between the Seller and the Buyer nor shall ${orgDetail.app_name} have any obligation or liabilities in respect of such contract.`;

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
				{...rest}
			>
				<Flex flexDirection="row" align="center" width="100%">
					{orgDetail.logo && (
						<OrgLogo
							orgDetail={orgDetail}
							size="lg"
							// size={{ base: "md", lg: "lg" }}
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
					<Flex
						flexGrow={1}
						flexDirection="column"
						className="shop flex"
					>
						<Text fontSize={{ base: "1.2em", lg: "1.4em" }}>
							{userData?.userDetails?.shop_name}
						</Text>
						<Text
							fontSize={{ base: "0.65em", lg: "0.7em" }}
							noOfLines={1}
						>
							{userData?.userDetails?.shopaddress}
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
						Powered by <strong>{orgDetail.org_name}</strong>
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
