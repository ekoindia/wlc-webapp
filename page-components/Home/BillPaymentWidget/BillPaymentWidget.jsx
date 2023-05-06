import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { IcoButton } from "components";
import { TransactionIds } from "constants";
import { useMenuContext } from "contexts/MenuContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * A <BillPaymentWidget> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<BillPaymentWidget></BillPaymentWidget>` TODO: Fix example
 */
const BillPaymentWidget = () => {
	const router = useRouter();
	const [isCardVisible, setIsCardVisible] = useState(false);
	const [data, setData] = useState([]);
	const [more, setMore] = useState(false);
	console.log("data", data);
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions;

	useEffect(() => {
		if (!role_tx_list[TransactionIds.BILL_PAYMENT]) {
			return;
		}
		//getting group_interaction_ids from recharge & bill payment
		let group_interaction_ids =
			role_tx_list[TransactionIds.BILL_PAYMENT].group_interaction_ids;
		// str to array
		group_interaction_ids = group_interaction_ids.split(",").map(Number);

		const bbps_tx_list = [];

		group_interaction_ids.forEach((id) => {
			if (id in role_tx_list) {
				bbps_tx_list.push({
					id: id,
					...role_tx_list[id],
				});
			}
		});
		setData(bbps_tx_list); // set the new array to the data state
		setIsCardVisible(bbps_tx_list.length > 0);
	}, [role_tx_list]);

	useEffect(() => {
		if (data.length > 8) {
			setData(data.slice(0, 7));
			setMore(true);
		}
	}, [data]);

	const handleIconClick = (id) => {
		router.push(
			`transaction/${TransactionIds.BILL_PAYMENT}/` + (id ? `${id}` : "")
		);
	};
	return (
		<div>
			{isCardVisible && (
				<Flex
					h={{
						base: "auto",
						md: "387px",
					}}
					direction="column"
					background="white"
					p="5"
					borderRadius="10px"
					m={{ base: "16px", md: "auto" }}
				>
					<Box fontSize={{ base: "sm", md: "md" }}>
						<Text as="b">Recharge & bill payments</Text>
					</Box>
					<SimpleGrid
						columns="4"
						spacing={{ base: "4", md: "12" }}
						alignItems="flex-start"
						justifyContent="center"
					>
						{data.map((transaction, index) => (
							<Box
								key={index}
								display="flex"
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
								pt={{ base: "22px" }}
							>
								<IcoButton
									title={transaction.label}
									iconName={transaction.icon}
									iconStyle={{
										width: "30px",
										height: "30px",
									}}
									size={{
										base: "48px",
										lg: "56px",
										xl: "64px",
									}}
									theme="dark"
									rounded="full"
									onClick={() =>
										handleIconClick(transaction.id)
									}
								/>
								<Text
									size={{ base: "sm", md: "lg" }}
									pt={{ base: "5px" }}
									fontSize={{
										base: "10px",
										md: "sm",
										lg: "16px/18px",
										xl: "16px/18px",
									}}
									textAlign="center"
								>
									{transaction.label.length > 17
										? `${transaction.label.slice(0, 17)}...`
										: transaction.label}
								</Text>
							</Box>
						))}
						{more ? (
							<Box
								display="flex"
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
								pt={{ base: "22px" }}
							>
								<IcoButton
									title="more"
									iconName="more-horiz"
									iconStyle={{
										width: "30px",
										height: "30px",
									}}
									size={{
										base: "48px",
										lg: "56px",
										xl: "64px",
									}}
									theme="gray"
									rounded="full"
									onClick={() => handleIconClick()}
								/>
								<Text
									size={{ base: "sm", md: "lg" }}
									pt={{ base: "5px" }}
									fontSize={{
										base: "10px",
										md: "sm",
										lg: "16px/18px",
										xl: "16px/18px",
									}}
									textAlign="center"
								>
									More
								</Text>
							</Box>
						) : null}
					</SimpleGrid>
					{/* Once data is there for offers,show this row*/}
					{/* <Flex
					justifyContent="space-between"
					bg="#F9F7F0"
					h={{ base: "30px", md: "50px" }}
					alignItems="center"
					borderRadius="10px"
					w="100% auto"
					m={{ base: "0px 0px 0px 0px", md: "140px 10px 0px 10px" }}
					p="0px 10px 0px 10px"
				>
					<Text fontSize={{ base: "10px", lg: "sm" }}>
						Get 10% off on LP Gas booking
					</Text>
					<Text
						marginLeft="auto"
						color="primary.DEFAULT"
						display="inline-block"
						fontSize={{ base: "10px", md: "md" }}
					>
						Book now
					</Text>
					<Icon
						marginLeft="10px"
						display="inline-block"
						name="arrow-forward"
						color="primary.DEFAULT"
					/>
				</Flex> */}
				</Flex>
			)}
		</div>
	);
};

export default BillPaymentWidget;
