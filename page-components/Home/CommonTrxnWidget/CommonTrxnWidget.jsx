import { Box, Flex, GridItem, SkeletonCircle, Text } from "@chakra-ui/react";
/**
 * A CommonTransaction component
 * Is a set of icon which have most common transaction done on platform
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<CommonTrxnWidget></CommonTrxnWidget>` TODO: Fix example
 */
const CommonTrxnWidget = () => {
	return (
		<div>
			<GridItem>
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
					<Flex direction={"column"}>
						<SkeletonCircle size="12" />
					</Flex>
				</Flex>
			</GridItem>
		</div>
	);
};

export default CommonTrxnWidget;
