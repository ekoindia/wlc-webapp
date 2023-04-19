import { Box, Flex, GridItem, SkeletonCircle, Text } from "@chakra-ui/react";
/**
 * A <CommonTransaction> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<CommonTransaction></CommonTransaction>`
 */
const CommonTransaction = ({ className = "", ...props }) => {
	return (
		<div className={`${className}`} {...props}>
			<GridItem>
				<Flex
					h={{ base: "auto", sm: "350px", md: "387px", lg: "400px" }}
					w={{ base: "100%", sm: "100%", md: "450px", lg: "480px" }}
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

export default CommonTransaction;
