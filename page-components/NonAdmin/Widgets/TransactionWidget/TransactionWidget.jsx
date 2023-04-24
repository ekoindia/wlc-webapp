import { Box, Flex, Text } from "@chakra-ui/react";

/**
 * A TransactionWidget component
 * Is a card on home screen which will show 10 recent transaction
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionWidget></TransactionWidget>`
 */
const TransactionWidget = () => {
	return (
		<div>
			<Flex
				minH={{
					base: "auto",
					sm: "200px",
					md: "387px",
					lg: "320px",
					xl: "400px",
				}}
				maxH={{
					base: "auto",
					sm: "200px",
					md: "387px",
					lg: "400px",
					xl: "400px",
				}}
				// w={{ base: "100%", sm: "100%", md: "450px", lg: "480px" }}
				minW={{
					base: "100%",
					sm: "100%",
					md: "420px",
					lg: "360px",
					xl: "350px",
				}}
				maxW={{
					base: "100%",
					sm: "100%",
					md: "420px",
					lg: "400px",
					xl: "480px",
				}}
				borderRadius={{
					base: "0px 0px 0px 0px",
					sm: "0px 0px 2px 2px",
					md: "15px",
				}}
				background-repeat="no-repeat"
				backgroundSize="cover"
				direction={"column"}
				align={{ base: "flex-start" }}
				rowGap={{ base: "20px", md: "0px" }}
				px={{ base: "20px", md: "20px" }}
				py={{ base: "20px", md: "24px" }}
				bg={"white"}
			>
				<Box>
					<Text as="b">Most common transactions</Text>
				</Box>
				<Flex direction={"column"}></Flex>
			</Flex>
		</div>
	);
};

export default TransactionWidget;
