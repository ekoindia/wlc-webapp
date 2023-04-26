import {
	Box,
	Flex,
	SimpleGrid,
	Text,
	useBreakpointValue,
} from "@chakra-ui/react";
import { Button, IcoButton } from "components";
import { TransactionTypes } from "constants";
import { useMenuContext } from "contexts/MenuContext";
import { useEffect, useState } from "react";
/**
 * A CommonTransaction component
 * Is a set of icon which have most common transaction done on platform
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<CommonTransaction></CommonTransaction>`
 */
const transactionsData = [
	{
		title: "Aeps Cashout",
		commission: "5%",
		iconName: "aeps-outline",
		buttonTitle: "View Transaction 1",
	},
	{
		title: "DMT High Limit",
		commission: "7%",
		iconName: "dmt-outline",
		buttonTitle: "View Transaction 2",
	},
	{
		title: "Mobile Recharge",
		commission: "7%",
		iconName: "smartphone-circle-button",
		buttonTitle: "View Transaction 2",
	},
	{
		title: "Credit Card Bill",
		commission: "7%",
		iconName: "creditcard-outline",
		buttonTitle: "View Transaction 2",
	},
	{
		title: "LIC Bill Pay",
		commission: "7%",
		iconName: "insurance-outline",
		buttonTitle: "View Transaction 2",
	},
];

const CommonTransaction = () => {
	const [data, setData] = useState([]);
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions;

	useEffect(() => {
		let group_interaction_ids =
			role_tx_list[TransactionTypes.RECHARGE_AND_BILL_PAYMENT]
				.group_interaction_ids;

		group_interaction_ids = group_interaction_ids.split(",").map(Number);

		const temp = []; // create a new array to store the new data

		group_interaction_ids.forEach((id) => {
			if (id in role_tx_list) {
				temp.push(role_tx_list[id]); // push each new element to the new array
			}
		});

		setData(temp); // set the new array to the data state
	}, [role_tx_list]); //TODO check dependency for this useEffect 👆👆

	console.log("data", data);

	const [showAll, setShowAll] = useState(false);

	const breakpointValue = useBreakpointValue({
		base: 3,
		md: transactionsData.length,
	});

	const showAllButton = useBreakpointValue({
		base: transactionsData.length > 3 && !showAll,
		md: transactionsData.length > 3 && !showAll,
		lg: false,
	});

	const showTransactions = showAll
		? transactionsData
		: transactionsData.slice(0, breakpointValue);
	return (
		<div>
			<Flex
				minH={{
					base: "auto",
					sm: "auto",
					md: "387px",
					lg: "300px",
					xl: "387px",
				}}
				maxH={{
					base: "auto",
					sm: "auto",
					md: "387px",
					lg: "400px",
					xl: "387px",
				}}
				minW={{
					base: "auto",
					sm: "auto",
					md: "380px",
					lg: "360px",
					xl: "350px",
				}}
				maxW={{
					base: "auto",
					sm: "auto",
					md: "1000px",
					lg: "400px",
					xl: "580px",
				}}
				borderRadius={{
					base: "10px 10px 10px 10px",
					sm: "10px 10px 10px 10px",
					md: "10px",
				}}
				background={"white"}
				direction={"column"}
				// align={{
				// 	base: "flex-start",
				// }}
				rowGap={{
					base: "20px",
					sm: "30px",
					md: "50px",
					lg: "20px",
					xl: "10px",
				}}
				px={{
					base: "20px",
					sm: "40px",
					md: "18px",
					lg: "15px",
					xl: "20px",
				}}
				py={{
					base: "12px",
					sm: "30px",
					md: "18px",
					lg: "20px",
					xl: "25px",
				}}
				m={{ base: "18px", sm: "10px", md: "0px" }}
			>
				<Box>
					<Text as="b">Most common transactions</Text>
				</Box>
				<SimpleGrid
					columns={{ base: 3, sm: 3, md: 3 }}
					spacing={{ lg: "4", xl: "6" }}
					justifyContent="center"
					alignItems="center"
					textAlign="center"
				>
					{showTransactions.map((transaction, index) => (
						<Box
							key={index}
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							borderRight={
								index !== 2 && (index + 1) % 3
									? "1px solid #E9EDF1"
									: "none"
							}
							// mb={{ base: "30px", lg: "40px", xl: "40px" }}
						>
							<IcoButton
								title={transaction.buttonTitle}
								iconName={
									index < 5
										? transaction.iconName
										: "more-horiz"
								}
								iconStyle={{
									width: "30px",
									height: "30px",
								}}
								size={{ base: "48px", lg: "56px", xl: "64px" }}
								theme="light"
								round="full"
								onClick={() => {
									console.log("clicked");
								}}
								alignContent="center"
								alignItems="center"
							></IcoButton>
							<Text
								fontSize={{ base: "11px", lg: "sm", xl: "md" }}
								color="accent.DEFAULT"
								pt={{ base: "5px" }}
							>
								{transaction.title}
							</Text>
							<Text
								fontSize={{ base: "11px", lg: "xs" }}
								color="shadow.dark"
								pt={{ base: "5px" }}
							>
								{transaction.commission} Commission
							</Text>
						</Box>
					))}
				</SimpleGrid>
				{showAllButton && (
					<Flex
						justifyContent="center"
						alignItems="center"
						textAlign="center"
					>
						<Button
							onClick={() => setShowAll(true)}
							justifyContent="center"
						>
							+ Show All
						</Button>
					</Flex>
				)}
			</Flex>
		</div>
	);
};

export default CommonTransaction;
