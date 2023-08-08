import { Box, Flex } from "@chakra-ui/react";
import { Icon } from "components";

/**
 * A <DetailedStatementCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatementCard></DetailedStatementCard>`
 */

const DetailedStatementCard = ({ item }) => {
	return (
		<Flex
			direction="column"
			bg="white"
			fontSize="xs"
			p="20px"
			borderTop="1px solid var(--chakra-colors-divider)"
		>
			<Flex direction="column" fontSize="12px" rowGap="2">
				<Flex gap="2">
					<Box as="span" color="light">
						TID:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{item.transaction_id}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Date & Time:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{item.date_time}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Activity:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{item.activity}
					</Box>
				</Flex>
				<Flex direction={"column"}>
					<Box as="span" color="light">
						Description:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{item.description}
					</Box>
				</Flex>
			</Flex>
			<Flex justifyContent="space-between" mt="14px">
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
								size="14px"
								// h="10px"
							/>
						</Box>
					</Flex>
				</Flex>
				<Flex direction={"column"}>
					<Box as="span" color="light" fontSize="12px">
						Running Balance
					</Box>
					<Box fontSize="16px" fontWeight="medium">
						&#x20B9;{item.running_balance}
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default DetailedStatementCard;
