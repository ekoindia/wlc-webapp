import { Box, Flex, GridItem, Text } from "@chakra-ui/react";
import { Button } from "components";
/**
 * A <QueryWidget> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<QueryWidget></QueryWidget>`
 */
const QueryWidget = ({ className = "", ...props }) => {
	return (
		<div className={`${className}`} {...props}>
			<GridItem>
				<Flex
					h={{ base: "240px", sm: "350px", md: "387px", lg: "400px" }}
					w={{ base: "100%", sm: "100%", md: "500px", lg: "500px" }}
					borderRadius={{
						base: "0px 0px 20px 20px",
						sm: "0px 0px 2px 2px",
						md: "20px",
					}}
					background="url('./havequery.svg'), linear-gradient(to bottom, #2dbb5c, #02762c)"
					backgroundRepeat="no-repeat"
					backgroundSize="cover"
					direction={{ base: "row", md: "column" }}
					p={{ base: "25px 10px 25px 10px" }}
				>
					<Flex
						width={{ md: "100%" }}
						alignContent="center"
						justifyContent="center"
						alignItems="baseline"
						color={"white"}
						as="b"
					>
						<Text fontSize={"21px"} display={"inline"}>
							Have a
						</Text>
						<Text
							fontSize={"30px"}
							display={"inline"}
							pl={{ base: "1px", md: "3px" }}
						>
							QUERY?
						</Text>
					</Flex>
					<Box textAlign={"center"} mt={{ base: "0px", md: "40px" }}>
						<Button>Write to us</Button>
					</Box>
				</Flex>
			</GridItem>
		</div>
	);
};

export default QueryWidget;
