import { Box, Flex } from "@chakra-ui/react";

/**
 * A <CommissionsCard> component
 * @param 	{object}	item	Item object containing transaction details
 */
const CommissionsCard = ({ item }) => {
	const { transaction_value, commission, biller_name } = item ?? {};

	const commissionCardData = [
		{ label: "Transaction value", value: transaction_value },
		{ label: "Commission", value: commission },
		{ label: "Biller Name", value: biller_name },
	];

	return (
		<Flex
			direction="column"
			fontSize="sm"
			bg="white"
			borderRadius="10px"
			p="20px"
		>
			{commissionCardData.map(({ label, value }) => {
				if (!value) return null; // in money transfer's case biller name is not present
				return (
					<Flex gap="2" key={label}>
						<Box as="span" color="light" whiteSpace="nowrap">
							{label}:
						</Box>
						<Box as="span" color="dark">
							{value}
						</Box>
					</Flex>
				);
			})}
		</Flex>
	);
};

export default CommissionsCard;
