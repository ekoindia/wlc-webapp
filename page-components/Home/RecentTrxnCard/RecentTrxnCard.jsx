import { Box, Flex, Text } from "@chakra-ui/react";
/**
 * A <RecentTrxnCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<RecentTrxnCard></RecentTrxnCard>` TODO: Fix example
 */
const RecentTrxnCard = ({ prop1, ...rest }) => {
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
					<Text as="b">Recent transactions</Text>
				</Box>
				<Flex direction={"column"}></Flex>
			</Flex>
		</div>
	);
};

export default RecentTrxnCard;
