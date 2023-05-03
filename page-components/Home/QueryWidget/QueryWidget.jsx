import { Flex, GridItem, Text, useBreakpointValue } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { useUser } from "contexts/UserContext";
/**
 * Contact widget in home page
 * Contact widget on home page
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<QueryWidget></QueryWidget>` TODO: Fix example
 */
const QueryWidget = () => {
	const { userData } = useUser();
	const data = userData?.userDetails?.contacts ?? [];
	const hoverBg = useBreakpointValue({
		base: "white",
		md: "transparent",
	});

	function handleContact() {
		// Replace with the URL of your mailbox
		const mailboxUrl = `mailto:${data[0].email}`;
		window.location.href = mailboxUrl;
	}

	if (!(data && data.length > 0)) {
		return null;
	}

	return (
		<div>
			<GridItem>
				<Flex
					minH={{
						base: "auto",
						sm: "200px",
						md: "387px",
						lg: "300px",
						xl: "387px",
					}}
					maxH={{
						base: "auto",
						sm: "200px",
						md: "387px",
						lg: "400px",
						xl: "387px",
					}}
					minW={{
						base: "100%",
						sm: "100%",
						md: "380px",
						lg: "360px",
						xl: "350px",
					}}
					maxW={{
						base: "100%",
						sm: "100%",
						md: "1000px",
						lg: "400px",
						xl: "580px",
					}}
					borderRadius={{
						base: "0px 0px 0px 0px",
						sm: "0px 0px 2px 2px",
						md: "10px",
					}}
					background={{
						base: "linear-gradient(to bottom, #2dbb5c, #02762c)",
						md: "url('./havequery.svg') no-repeat, linear-gradient(to bottom, #2dbb5c, #02762c)",
					}}
					backgroundSize="cover"
					direction={"column"}
					align={{
						base: "flex-start",
						sm: "flex-start",
						md: "center",
					}}
					rowGap={{
						base: "20px",
						sm: "30px",
						md: "50px",
						lg: "30px",
					}}
					px={{
						base: "20px",
						sm: "40px",
						md: "18px",
						lg: "15px",
						xl: "25px",
					}}
					py={{
						base: "20px",
						sm: "30px",
						md: "18px",
						lg: "20px",
						xl: "25px",
					}}
					backgroundPosition="center"
				>
					<Flex
						width={{ md: "100%" }}
						alignContent="center"
						justifyContent="center"
						alignItems="baseline"
						color={"white"}
						as="b"
						pt={{ base: "0px", sm: "20px", md: "40px", lg: "18px" }}
						pb={{ base: "0px", sm: "20px", md: "10px", lg: "25px" }}
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
						{data[0]?.cellnumber ? (
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
										fontSize={{
											base: "0.700rem",
											md: "18px",
										}}
										textAlign={{ base: "auto", md: "auto" }}
										paddingLeft={{
											base: "0px",
											md: "15px",
										}}
									>
										Call us on
									</Text>
									<a href={`tel:${data[0].cellnumber}`}>
										<Text
											as="b"
											color={"white"}
											fontSize={{
												base: "0.700rem",
												md: "lg",
											}}
										>
											+91 {data[0].cellnumber}
										</Text>
									</a>
								</Flex>
							</Flex>
						) : null}

						{data[0]?.cellnumber && data[0]?.email ? (
							<Text
								color={"white"}
								display={{ base: "none", md: "block" }}
								textAlign={{ base: "left", md: "center" }}
							>
								or
							</Text>
						) : null}

						{data[0]?.email ? (
							<Flex direction={"column"}>
								<Button
									bg={"white"}
									border={{ base: "", md: "1px solid white" }}
									_hover={{ bg: hoverBg }}
									onClick={handleContact}
									icon={
										<Icon
											name="chat-outline"
											h={{ base: "18px", md: "20px" }}
											color="accent.DEFAULT"
										/>
									}
									borderRadius={{ base: "5px", md: "10px" }}
									h={{
										base: "40px",
										md: "48px",
										lg: "44px",
										xl: "48px",
									}}
									w={{
										base: "120px",
										md: "190px",
										lg: "180px",
										xl: "190px",
									}}
								>
									<Text
										fontSize={{ base: "sm" }}
										color="accent.DEFAULT"
									>
										Write to us
									</Text>
								</Button>
							</Flex>
						) : null}
					</Flex>
				</Flex>
			</GridItem>
		</div>
	);
};

export default QueryWidget;
