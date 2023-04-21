import { Flex, GridItem, Text, useBreakpointValue } from "@chakra-ui/react";
import { Button, Icon } from "components";
/**
 * A <QueryWidget> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<QueryWidget></QueryWidget>`
 */
const QueryWidget = ({ className = "", ...props }) => {
	const hoverBg = useBreakpointValue({
		base: "white",
		md: "transparent",
	});
	const handleContact = () => {
		console.log("handleContact");
	};
	return (
		<div className={`${className}`} {...props}>
			<GridItem>
				<Flex
					h={{ base: "auto", sm: "200px", md: "387px", lg: "400px" }}
					w={{ base: "100%", sm: "100%", md: "450px", lg: "480px" }}
					borderRadius={{
						base: "0px 0px 20px 20px",
						sm: "0px 0px 2px 2px",
						md: "20px",
					}}
					background={{
						base: "linear-gradient(to bottom, #2dbb5c, #02762c)",
						md: "url('./havequery.svg') no-repeat, linear-gradient(to bottom, #2dbb5c, #02762c)",
					}}
					// background-repeat= "no-repeat !important"
					backgroundSize="cover"
					direction={"column"}
					align={{
						base: "flex-start",
						sm: "flex-start",
						md: "center",
					}}
					rowGap={{ base: "20px", sm: "30px", md: "50px" }}
					px={{ base: "20px", sm: "40px", md: "20px" }}
					py={{ base: "20px", sm: "30px", md: "24px" }}
					backgroundPosition="center"
				>
					<Flex
						width={{ md: "100%" }}
						alignContent="center"
						justifyContent="center"
						alignItems="baseline"
						color={"white"}
						as="b"
						pt={{ base: "0px", sm: "20px", md: "40px" }}
						direction={"row"}
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

					<Flex
						alignContent={{ base: "left", md: "center" }}
						w={{ base: "100%", md: "auto" }}
						direction={{ base: "row", md: "column" }}
						rowGap="30px"
						justifyContent="space-between"
					>
						<Flex>
							<Icon
								h={{ base: "32px", md: "32px" }}
								name="phone-circle-outline"
								color="white"
								display="flex"
								mt={{ base: "2px", md: "23px" }}
								mr={{ base: "4px", md: "8px" }}
							/>
							<Flex direction={"column"}>
								<Text
									color={"white"}
									fontSize={{ base: "0.700rem", md: "lg" }}
									textAlign={{ base: "auto", md: "center" }}
								>
									Call us on
								</Text>
								<Text
									as="b"
									color={"white"}
									fontSize={{ base: "0.700rem", md: "lg" }}
								>
									+91 124 456 6200
								</Text>
							</Flex>
						</Flex>
						<Text
							color={"white"}
							display={{ base: "none", md: "block" }}
							textAlign={{ base: "left", md: "center" }}
						>
							or
						</Text>
						<Flex direction={"column"}>
							<Button
								bg={{ base: "white", md: "transparent" }}
								border={{ base: "", md: "1px solid white" }}
								_hover={{ bg: hoverBg }}
								color={{ base: "#11299E", md: "white" }}
								onClick={handleContact}
								icon={
									<Icon
										name="chat-outline"
										h={{ base: "18px", md: "20px" }}
									/>
								}
								borderRadius="10px"
								h={{ base: "40px", md: "48px" }}
								w={{ base: "120px", md: "190px" }}
							>
								<Text fontSize={{ base: "sm" }}>
									Write to us
								</Text>
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</GridItem>
		</div>
	);
};

export default QueryWidget;
