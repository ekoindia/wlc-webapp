import { Box, Flex, GridItem, Text } from "@chakra-ui/react";
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
					h={{ base: "240px", sm: "350px", md: "387px", lg: "400px" }}
					w={{ base: "100%", sm: "100%", md: "450px", lg: "480px" }}
					borderRadius={{
						base: "0px 0px 20px 20px",
						sm: "0px 0px 2px 2px",
						md: "15px",
					}}
					background="white"
					direction={{ base: "row", md: "column" }}
					p={{ base: "15px 10px 15px 15px" }}
				>
					<Box>
						<Text as="b">Most common transactions</Text>
					</Box>
					<Flex direction={"column"}>
						<div
							height="25px"
							width="25px"
							background-color="black"
							border-radius="50%"
							display="inline-block"
						></div>
					</Flex>
				</Flex>
			</GridItem>
		</div>
	);
};

export default CommonTransaction;
