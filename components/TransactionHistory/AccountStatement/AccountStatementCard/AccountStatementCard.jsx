import { Box, Flex } from "@chakra-ui/react";

const AccountStatementCard = (props) => {
	//const { item } = props;
	const item = {
		transactionId: 3027555195,
		datetime: "29/11/2022, 09:58:48 AM",
		activity: "DMT Commission",
		description:
			"Saurabh Mullick, 9654110669 A/C:20082437069 STATE BANK OF INDIA",
		amount: "20",
		type: "credit",
		balance: "123123",
	};
	return (
		<Flex direction="column" fontSize="12px" rowGap="2">
			<Flex gap="2">
				<Box as="span" color="light">
					Transaction ID:
				</Box>
				<Box as="span" color="dark">
					{/* {item.agent_mobile} */}
					{item.transactionId}
				</Box>
			</Flex>
			<Flex gap="2">
				<Box as="span" color="light">
					Date & Time:
				</Box>
				<Box as="span" color="dark">
					{/* {item.agent_mobile} */}
					{item.datetime}
				</Box>
			</Flex>
			<Flex gap="2">
				<Box as="span" color="light">
					Activity:
				</Box>
				<Box as="span" color="dark">
					{/* {item.agent_mobile} */}
					{item.activity}
				</Box>
			</Flex>
			<Flex gap="2">
				<Box as="span" color="light">
					Description:
				</Box>
				<Box as="span" color="dark">
					{/* {item.agent_mobile} */}
					{item.description}
				</Box>
			</Flex>
			<Flex gap="2" fontSize="16px" fontWeight="medium">
				<Box as="span" color="dark">
					{/* {item.agent_mobile} */}
					&#x20B9;{item.amount}
				</Box>
			</Flex>
		</Flex>
	);
};

export default AccountStatementCard;
