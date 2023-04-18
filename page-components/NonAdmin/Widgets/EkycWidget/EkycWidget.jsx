import { Box, Flex, GridItem, Image, Text } from "@chakra-ui/react";
import { Buttons } from "components";
/**
 * A <EkycWidget> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<EkycWidget></EkycWidget>`
 */
const EkycWidget = ({ className = "", ...props }) => {
	return (
		// <Grid
		// 	templateColumns={{
		// 		base: "repeat(auto-fit,minmax(100%,0.90fr))",
		// 		sm: "repeat(auto-fit,minmax(380px,0.90fr))",
		// 		md: "repeat(auto-fit,minmax(360px,1fr))",
		// 		lg: "repeat(auto-fit,minmax(490px,1fr))",
		// 	}}
		// 	py={{ base: "0px", md: "20px" }}
		// 	gap={{ base: (2, 4), md: (4, 2), lg: (4, 6) }}
		// >
		<GridItem>
			<Flex
				h={{ base: "240px", sm: "350px", md: "387px", lg: "400px" }}
				w={{ base: "100%", sm: "100%", md: "500px", lg: "500px" }}
				border="1px solid grey"
				borderRadius={{
					base: "0px 0px 20px 20px",
					sm: "0px 0px 2px 2px",
					md: "20px",
				}}
				background="url('./bg.svg'), linear-gradient(to bottom, #11299e, #09154f)"
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
							fontFamily="Inter"
						>
							Your eKYC is not completed!
						</Text>

						<Text
							fontSize={{ base: "10px", md: "16px" }}
							lineHeight={{ base: "16px", md: "27px" }}
							color="#FFFFFF"
						>
							You have pending Aadahar verification, Address proof
							verification. Please complete the same to get going.
						</Text>
					</Box>
					<Box textAlign={"center"} mt={{ base: "0px", md: "40px" }}>
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
					</Box>
					<Box
						pt={{ base: "20px", md: "50px" }}
						display={"flex"}
						justifyContent={{ base: "left", md: "center" }}
					>
						<Buttons
							fontWeight={"medium"}
							borderRadius="6px"
							bg="transparent"
							_hover={{ bg: "transparent" }}
							border="2px solid white"
						>
							Proceed &gt;
						</Buttons>
					</Box>
				</Flex>
			</Flex>
		</GridItem>
		// </Grid>
	);
};

export default EkycWidget;
