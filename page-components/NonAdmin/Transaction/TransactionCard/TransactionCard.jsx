import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Box,
	Flex,
} from "@chakra-ui/react";
import { getStatusStyle } from "helpers";
import { useState } from "react";

/**
 * A <NetworkCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkCard></NetworkCard>`
 */

const TransactionCard = (props) => {
	const [expanded, setExpanded] = useState(false);
	// const { item } = props;
	const item = {
		transactionId: 55555555,
		status: "AePS Cashout to xxxxxx9834",
		datetime: "10 Oct 2021, 6.30 PM",
		activity: "DMT Commission",
		account_status: "Cancel",
		amount: "20",
		type: "credit",
		Transaction: "Send Cash (Bank Transfer)",
		BalanceAmount: 48350.0,
	};
	return (
		<>
			<Flex
				direction="column"
				fontSize={{ base: "sm" }}
				// pl="42px"
				// py="10px"
				minH="90px"
				maxH="200px"
				borderRadius=" 10px"
				p="10px"
			>
				<Flex justifyContent={"space-between"}>
					<Box color="light" fontSize={{ base: "10px " }}>
						{/* {getNameStyle(item.name)} */}
						{item.datetime}
					</Box>
					<Box>{getStatusStyle(item.account_status)}</Box>
				</Flex>
				<Flex gap="2">
					<Box
						as="span"
						color="dark"
						fontSize={"12px"}
						fontWeight="semibold"
					>
						{item.status}
					</Box>
				</Flex>
				<Flex gap="2" fontSize={"10px"} color="dark">
					<Box as="span" color="light">
						Transaction Id :
					</Box>
					<Box as="span" color="dark">
						{item.transactionId}
					</Box>
				</Flex>

				<Accordion>
					<AccordionItem
						border="none"
						outline="none"
						_focus={{ boxShadow: "none" }}
					>
						<AccordionButton
							color="primary.DEFAULT"
							fontSize={"10px"}
							bg="white"
							onClick={() => setExpanded(true)}
							_active={{ bg: "white" }}
							display={expanded ? "none" : "block"}
							textAlign={"start"}
						>
							...Show more
						</AccordionButton>
						<AccordionPanel display={expanded ? "block" : "none"}>
							<Flex gap="2px">
								<Box as="span" fontSize={"10px"} color="light">
									Transaction :
								</Box>
								<Box
									as="span"
									color="dark"
									fontSize={"10px"}
									fontWeight="medium"
								>
									{item.Transaction}
								</Box>
							</Flex>
							<Flex gap="2px">
								<Box as="span" fontSize={"10px"} color="light">
									Ammount :
								</Box>
								<Box
									as="span"
									color="dark"
									fontSize={"10px"}
									fontWeight="medium"
								>
									&#x20B9;{item.amount}
								</Box>
							</Flex>
							<Flex gap="2px">
								<Box as="span" fontSize={"10px"} color="light">
									BalanceAmmount :
								</Box>
								<Box
									as="span"
									color="dark"
									fontSize={"10px"}
									fontWeight="medium"
								>
									&#x20B9;{item.BalanceAmount}
								</Box>
							</Flex>
							<AccordionButton
								color="primary.DEFAULT"
								fontSize={"10px"}
								bg="white"
								onClick={() => setExpanded(false)}
								border="none"
								outline="none"
								_focus={{ boxShadow: "none" }}
							>
								...Show less
							</AccordionButton>
						</AccordionPanel>{" "}
					</AccordionItem>
				</Accordion>
			</Flex>
		</>
	);
};

export default TransactionCard;
