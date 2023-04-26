/**
 * A TransactionWidget component
 * Is a card on home screen which will show 10 recent transaction
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionWidget></TransactionWidget>`
 */

import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { IcoButton, Icon } from "components";
const transactionsData = [
	{
		title: "Mobile",
		iconName: "smartphone-circle-button",
	},
	{
		title: "DTH",
		iconName: "satelite-outline",
	},
	{
		title: "Electricity",
		iconName: "electricity-outline",
	},
	{
		title: "Gas",
		iconName: "gas-outline",
	},
	{
		title: "Insurance",
		iconName: "insurance-outline",
	},
	{
		title: "Tax Payment",
		iconName: "percent-outline",
	},
	{
		title: "Data Card Recharge",
		iconName: "pendrive-outline",
	},
	{
		title: "Credit Card",
		iconName: "creditcard-outline",
	},
];
const TransactionWidget = () => {
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
					xl: "400px",
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
				>
					{transactionsData.map((transaction, index) => (
						<Box
							key={index}
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
						>
							<IcoButton
								title={transaction.buttonTitle}
								iconName={transaction.iconName}
								iconStyle={{
									width: "30px",
									height: "30px",
								}}
								size={{ base: "48px", lg: "56px", xl: "64px" }}
								theme="dark"
								round="full"
								onClick={() => {
									console.log("clicked");
								}}
							></IcoButton>
							<Text
								size={{ base: "sm", md: "lg" }}
								pt={{ base: "5px" }}
								fontSize={{ base: "sm", md: "sm", lg: "sm" }}
							>
								{transaction.title}
							</Text>
						</Box>
					))}
				</SimpleGrid>
				<Flex
					justifyContent="space-between"
					bg="#F9F7F0"
					h="50px"
					alignItems="center"
					borderRadius="10px"
					w="auto"
					margin="0px 10px 0px 10px"
					p="0px 10px 0px 10px"
				>
					<Text>Get 10% off on LP Gas booking</Text>
					<Text
						marginLeft="auto"
						color="primary.DEFAULT"
						display="inline-block"
					>
						Book now
					</Text>
					<Icon
						marginLeft="10px"
						display="inline-block"
						name="arrow-forward"
						color="primary.DEFAULT"
					/>
				</Flex>
			</Flex>
		</div>
	);
};

export default TransactionWidget;
