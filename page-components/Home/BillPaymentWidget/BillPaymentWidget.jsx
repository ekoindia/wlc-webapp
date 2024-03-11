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
	const [billPaymentOptions, setBillPaymentOptions] = useState([]);
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions;

	useEffect(() => {
		const billPayment = role_tx_list[TransactionIds.BILL_PAYMENT];
		if (!billPayment) return;

		const group_interaction_ids = billPayment.group_interaction_ids
			.split(",")
			.map(Number);
		const bbps_tx_list = group_interaction_ids
			.filter((id) => id in role_tx_list)
			.map((id) => ({ id, ...role_tx_list[id] }));

		setBillPaymentOptions(
			bbps_tx_list.length > 8
				? [
						...bbps_tx_list.slice(0, 7),
						{ id: null, label: "More", icon: "more-horiz" },
				  ]
				: bbps_tx_list
		);
	}, [role_tx_list]);

	/**
	 * Handles click on bill payment option.
	 */
	const handleBillPaymentOptionClick = (id) => {
		router.push(
			`transaction/${TransactionIds.BILL_PAYMENT}/` + (id ? `${id}` : "")
		);
	};

	if (!billPaymentOptions?.length) return null;

	return (
		<WidgetBase title="Recharge & bill payments" noPadding>
			<SimpleGrid
				columns="4"
				mx="8px"
				rowGap={{ base: "4", md: "10", "2xl": "16" }}
				alignItems="flex-start"
				justifyContent="center"
			>
				{billPaymentOptions?.map(({ label, icon, id }, index) => (
					<Box
						key={index}
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
					>
						<IcoButton
							title={label}
							iconName={icon}
							size="md"
							theme="dark"
							onClick={() => handleBillPaymentOptionClick(id)}
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
							{label}
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
