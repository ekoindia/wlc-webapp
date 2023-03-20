import { Box, Flex } from "@chakra-ui/react";
import { Icon } from "components";

/**
 * A <DetailedStatementCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatementCard></DetailedStatementCard>`
 */

const DetailedStatementCard = (props) => {
	const { item } = props;
	// const item = {
	// 	transactionId: 3027555195,
	// 	datetime: "29/11/2022, 09:58:48 AM",
	// 	activity: "DMT Commission",
	// 	description:
	// 		"Saurabh Mullick, 9654110669 A/C:20082437069 STATE BANK OF INDIA",
	// 	amount: "20",
	// 	debit_credit: "DR",
	// 	type: "credit",
	// 	balance: "15,893.00",
	// };
	return (
		<>
			<Flex direction="column" fontSize="12px" rowGap="2">
				<Flex gap="2">
					<Box as="span" color="light">
						Transaction ID:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						{/* {item.transaction_id} */}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Date & Time:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						{item.date_time}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Activity:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						{item.activity}
					</Box>
				</Flex>
				<Flex direction={"column"}>
					<Box as="span" color="light">
						Description:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						{item.description}
					</Box>
				</Flex>
			</Flex>
			<Flex justifyContent="space-between" mt="14px">
				{" "}
				<Flex direction={"column"}>
					<Box as="span" color="light" fontSize="12px">
						Amount
					</Box>
					<Flex display={"flex"}>
						<Box fontSize="16px" fontWeight="medium">
							{" "}
							&#x20B9;{item.amount}
						</Box>
						&nbsp;
						<Box
							mt="3px"
							w="100%"
							h="100%"
							color={
								item.debit_credit === "DR" ? "error" : "success"
							}
						>
							<Icon
								name={
									item.debit_credit == "DR"
										? "arrow-increase"
										: "arrow-decrease"
								}
								width="14px"
								h="10px"
							/>
						</Box>
					</Flex>
				</Flex>
				<Flex direction={"column"}>
					<Box as="span" color="light" fontSize="12px">
						Running Balance
					</Box>
					<Box fontSize="16px" fontWeight="medium">
						{" "}
						&#x20B9;{item.running_balance}
					</Box>
				</Flex>
			</Flex>
		</>
	);
};

export default DetailedStatementCard;
