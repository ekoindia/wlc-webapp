import { Box, Flex, GridItem, Image, Text } from "@chakra-ui/react";
import { Button } from "components";
/**
 * A KycWidget component
 * Card which need to be show when kyc not fully completed
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<KycWidget></KycWidget>` TODO: Fix example
 */
const KycWidget = () => {
	return (
		<GridItem>
			<Box
				border="1px solid var(--chakra-colors-hint)"
				borderRadius="10px"
				bgGradient="linear(to-b, primary.light, primary.dark)"
			>
				<Flex
					h={{ base: "240px", sm: "350px", md: "387px", lg: "400px" }}
					// w={{ base: "100%", sm: "100%", md: "450px", lg: "480px" }}
					border="1px solid grey"
					borderRadius="10px"
					background="url('./bg.svg')"
					backgroundRepeat="no-repeat"
					backgroundSize="cover"
					direction={{ base: "row", md: "column" }}
					p={{ base: "25px 10px 25px 10px" }}
				>
					<Flex
						width={{ base: "200px", md: "100%" }}
						p={{ base: "0px 10px 0px 0px", md: "0px" }}
					>
						<Image
							mx="auto"
							src="/images/EmptyState.png"
							alt="logo"
							h={{
								base: "60.13px",
								sm: "54.13px",
								md: "54.13px",
								lg: "54.13px",
								xl: "95.76px",
								"2xl": "96px",
							}}
							w={{
								base: "60.13px",
								sm: "54.13px",
								md: "54.13px",
								lg: "54.13px",
								xl: "95.76px",
								"2xl": "96px",
							}}
						/>
					</Flex>
					<Flex direction={{ base: "column" }}>
						<Box
							textAlign={{
								base: "left",
								md: "center",
							}}
						>
							<Text
								fontSize={{
									base: "4vw",
									md: "1.6783216783216783vw",
								}}
								color="#FFD93B"
								fontWeight="semibold"
							>
								Your eKYC is not complete!
							</Text>

							<Text
								fontSize={{ base: "10px", md: "16px" }}
								lineHeight={{ base: "16px", md: "27px" }}
								color="#FFFFFF"
							>
								Your Aadahar & address proof verifications are
								pending. Please complete them to get going.
							</Text>
						</Box>
						{/* <Box
							textAlign={"center"}
							mt={{ base: "0px", md: "40px" }}
						>
							<Text
								fontSize="16px"
								color="white"
								display={{ base: "none", sm: "block" }}
							>
								Profile Score is{" "}
								<Text display={"inline"} color="#FFD93B">
									62%
								</Text>
							</Text>
						</Box> */}
						<Box
							pt={{ base: "20px", md: "50px" }}
							display={"flex"}
							justifyContent={{ base: "left", md: "center" }}
						>
							<Button
								fontWeight={"medium"}
								borderRadius="6px"
								bg="transparent"
								_hover={{ bg: "transparent" }}
								border="2px solid white"
							>
								Proceed &gt;
							</Button>
						</Box>
					</Flex>
				</Flex>
			</Box>
		</GridItem>
	);
};

export default KycWidget;
