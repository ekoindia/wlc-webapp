import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { IcoButton } from "components";
import { TransactionIds } from "constants";
import { useMenuContext } from "contexts/MenuContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { WidgetBase } from "..";

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
	const [data, setData] = useState([]);
	const [more, setMore] = useState(false);
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
		if (bbps_tx_list?.length > 8) {
			setData(bbps_tx_list.slice(0, 7));
			setMore(true);
		} else {
			setData(bbps_tx_list);
			setMore(false);
		}
	}, [role_tx_list]);

	const handleIconClick = (id) => {
		router.push(
			`transaction/${TransactionIds.BILL_PAYMENT}/` + (id ? `${id}` : "")
		);
	};

	if (!data.length) {
		return null;
	}

	return (
		<WidgetBase title="Recharge & bill payments" noPadding>
			<SimpleGrid
				columns="4"
				mx="8px"
				rowGap={{ base: "4", md: "10", "2xl": "16" }}
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
						// pt={{ base: "22px" }}
					>
						<IcoButton
							title={transaction.label}
							iconName={transaction.icon}
							size="md"
							// iconStyle={{
							// 	width: "30px",
							// 	height: "30px",
							// }}
							// size={{
							// 	base: "48px",
							// 	lg: "56px",
							// 	xl: "64px",
							// }}
							theme="dark"
							onClick={() => handleIconClick(transaction.id)}
						/>
						<Text
							pt={{ base: "10px" }}
							fontSize={{
								base: "xs",
								"2xl": "md",
							}}
							noOfLines={2}
							textAlign="center"
						>
							{transaction.label}
						</Text>
					</Box>
				))}
				{more ? (
					<Box
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						// pt={{ base: "22px" }}
					>
						<IcoButton
							title="more"
							iconName="more-horiz"
							size="md"
							// iconStyle={{
							// 	width: "30px",
							// 	height: "30px",
							// }}
							// size={{
							// 	base: "48px",
							// 	lg: "56px",
							// 	xl: "64px",
							// }}
							theme="gray"
							onClick={() => handleIconClick()}
						/>
						<Text
							pt={{ base: "5px" }}
							fontSize={{
								base: "xs",
								"2xl": "md",
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
						color="accent.DEFAULT"
						display="inline-block"
						fontSize={{ base: "10px", md: "md" }}
					>
						Book now
					</Text>
					<Icon
						marginLeft="10px"
						display="inline-block"
						name="arrow-forward"
						color="accent.DEFAULT"
					/>
				</Flex> */}
		</WidgetBase>
	);
};

export default BillPaymentWidget;
