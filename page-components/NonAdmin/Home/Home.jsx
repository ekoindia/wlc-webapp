import { Box, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import { Buttons } from "components";
/**
 * A <Home> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Home></Home>`
 */
const Home = () => {
	return (
		<Grid
			templateColumns={{
				base: "repeat(auto-fit,minmax(280px,0.90fr))",
				sm: "repeat(auto-fit,minmax(380px,0.90fr))",
				md: "repeat(auto-fit,minmax(360px,1fr))",
				lg: "repeat(auto-fit,minmax(490px,1fr))",
			}}
			justifyContent="center"
			py={{ base: "20px", md: "0px" }}
			gap={{ base: (2, 4), md: (4, 2), lg: (4, 6) }}
		>
			<GridItem>
				<Box
					h="400px"
					w="500px"
					border="1px solid grey"
					borderRadius={"10px"}
					backgroundImage="./bg.svg"
					objectFit={"cover"}
					backgroundRepeat="no-repeat"
					backgroundSize={"cover"}
				>
					<Box display={"flex"} justifyContent={"center"} mt="20px">
						<Image
							src="/images/EmptyState.png"
							alt="logo"
							borderRadius={"50px"}
							w="96px"
							minW={{
								base: "35px",
								sm: "34px",
								md: "30px",
								lg: "34px",
								xl: "30px",
								"2xl": "70px",
							}}
						/>
					</Box>
					<Box textAlign={"center"} mt="20px" gap="10px">
						<Text
							fontSize="20px"
							color="#FFD93B"
							fontWeight={"semibold"}
						>
							{" "}
							Your eKYC is not completed!
						</Text>
						<Text fontSize={"16px"} color="white">
							You have pending Aadahar verification, Address proof
							verification. Please complete the same to get going.
						</Text>
					</Box>
					<Box textAlign={"center"} mt="40px">
						<Text fontSize="16px" color="white">
							Profile Score is 62%
						</Text>
					</Box>
					<Box mt="50px" display={"flex"} justifyContent="center">
						<Buttons
							fontSize={"0.6vw"}
							w={{
								base: "140px",
								sm: "90px",
								md: "90px",
								lg: "100px",
								xl: "100px",
								"2xl": "200px",
							}}
							h={{
								base: "48px",
								sm: "30px",
								md: "30px",
								lg: "30px",
								xl: "34px",
								"2xl": "48px",
							}}
							fontWeight={"medium"}
							borderRadius="6px"
							bg="transparent"
							_hover={{ bg: "transparent" }}
							border="2px solid white"
						>
							<Text
								fontSize={{
									base: "14px",
									sm: "8px",
									md: "8px",
									lg: "10px",
									xl: "10px",
									"2xl": "20px",
								}}
							>
								View Profile &gt;
							</Text>
						</Buttons>
					</Box>
				</Box>
			</GridItem>
		</Grid>
	);
};

export default Home;
