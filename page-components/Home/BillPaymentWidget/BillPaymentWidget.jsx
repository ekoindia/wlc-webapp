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

		const temp = []; // create a new array to store the new data

		group_interaction_ids.forEach((id) => {
			if (id in role_tx_list) {
				temp.push(role_tx_list[id]); // push each new element to the new array
			}
		});
		console.log(
			role_tx_list,
			"LIC Bill PaymentLIC Bill PaymentLIC Bill Payment"
		);
		setData(temp); // set the new array to the data state
		setIsCardVisible(temp.length > 0);
	}, [role_tx_list]);
	const handleIconClick = (id) => {
		router.push(`transaction/${TransactionIds.BILL_PAYMENT}/${id}`);
	};
	return (
		<div>
			{isCardVisible && (
				<Flex
					h={{
						base: "auto",
						md: "387px",
					}}
					borderRadius="10px"
					background="white"
					direction="column"
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
						lg: "10px",
						xl: "25px",
					}}
					m={{ base: "18px", sm: "10px", md: "0px" }}
				>
					<Box>
						<Text as="b">Recharge & bill payments</Text>
					</Box>
					<SimpleGrid
						columns={{ base: 4, sm: 4, md: 4 }}
						spacing={{ base: "3", lg: "8", xl: "8" }}
						alignItems="flex-start"
					>
						{data.map((transaction, index) => (
							<Box
								key={index}
								display="flex"
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
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
								></IcoButton>
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
									{transaction.label}
								</Text>
							</Box>
						))}
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
