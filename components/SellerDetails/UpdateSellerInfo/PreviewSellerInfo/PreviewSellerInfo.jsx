import React from "react";
import {
	Flex,
	Box,
	Heading,
	Text,
	Button,
	useMediaQuery,
} from "@chakra-ui/react";
import { Buttons, Divider } from "../../..";

/**
 * A <PreviewPersonalInfo> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<PreviewPersonalInfo></PreviewPersonalInfo>`
 */
const PreviewSellerInfo = ({ className = "", ...props }) => {
	const [isTablet] = useMediaQuery("(max-width: 770px)");
	return (
		<Flex
			direction={"column"}
			w="full"
			h="auto"
			bg={{
				base: "none",
				md: "none",
				lg: "white",
				xl: "white",
				"2xl": "white",
			}}
			borderRadius="10px"
			boxShadow={{
				base: "none",
				md: "none",
				xl: "0px 5px 15px #0000000D",
				"2xl": "0px 5px 15px #0000000D",
			}}
			border={{
				base: "none",
				md: "none",
				xl: "1px solid #D2D2D2",
				lg: "1px solid #D2D2D2",
				"2xl": "1px solid #D2D2D2",
			}}
			p={{
				base: "0px",

				md: "0px",
				lg: "20px",
				xl: "20px",
				"2xl": "14px 30px 30px 30px",
			}}
			mt="20px"

			//
		>
			<Box
				// bg={{ base: "#FFFFFF", "2xl": "white" }}
				w={{
					base: "100%",
					md: "100%",
					lg: "97%",
					xl: "70vw",
					"2xl": "51vw",
				}}
				alignItems={{ base: "center", "2xl": "none" }}
			>
				<Flex
					direction={"column"}
					borderRadius={{ base: "10px" }}
					border={{ base: "1px solid #D2D2D2", md: "none" }}
					p={{ base: "12px", md: "0px" }}
					bg={"white"}
				>
					<Heading
						fontSize={{ base: "18px", "2xl": "1.5em" }}
						color={"#11299E"}
						fontWeight="semibold"
					>
						Angel Tech Private Limited
					</Heading>
					<Text
						fontSize={{ base: "12px", "2xl": "1em" }}
						color="#0F0F0F"
						pt={{ base: "5px", md: "initial" }}
					>
						Edit the fields below and click Preview. Click Cancel to
						return to Client HomePage without submitting
						information.
					</Text>
				</Flex>
			</Box>
			{!isTablet && <Divider color="#D2D2D2" mt="10px" />}
			<Flex
				bg="#FFFFFF"
				h="full"
				p={{
					base: "16px",
					sm: "20px",
					md: "20px",
					lg: "0px",
					xl: "0px",
				}}
				borderRadius={{ base: "10px", lg: "0", xl: "0" }}
				boxShadow={{
					base: "0px 5px 15px #0000000D",
					xl: "none",
					lg: "none",
					"2xl": "none",
				}}
				border={{
					base: " 1px solid #D2D2D2",
					xl: "none",
					lg: "none",
					"2xl": "none",
				}}
				mt={{ base: "16px", lg: "0px" }}
				mb={"20px"}
				direction="column"
			>
				<Box>
					<Box>
						<Text
							fontSize={{ base: "1rem" }}
							fontWeight={{ base: "semibold" }}
						>
							Membership related information
						</Text>
					</Box>

					<Flex
						mt={{ base: "1.8rem", "2xl": "0" }}
						// gap={{ base: "px" }}
						// alignContent={{
						// 	base: "",
						// 	md: "center",
						// 	"2xl": "center",
						// }}
						direction="column"
					>
						<Text fontSize="0.8rem">Created By</Text>

						<Text fontSize={"0.9rem"} fontWeight={"bold"}>
							Default ERO
						</Text>
					</Flex>
					<Flex
						mt={{ base: "1.8rem", "2xl": "0" }}
						// gap={{ base: "5px" }}
						// alignContent={{
						// 	base: "",
						// 	md: "center",
						// 	"2xl": "center",
						// }}
						direction="column"
					>
						<Text fontSize="0.8rem">Parent</Text>

						<Text fontSize={"0.9rem"} fontWeight={"bold"}>
							Vijay Kumar
						</Text>
					</Flex>
					<Flex
						mt={{ base: "1.8rem", "2xl": "0" }}
						// gap={{ base: "5px" }}
						// alignContent={{
						// 	base: "",
						// 	md: "center",
						// 	"2xl": "center",
						// }}
						direction="column"
					>
						<Text fontSize="0.8rem">External id</Text>

						<Text fontSize={"0.9rem"} fontWeight={"bold"}>
							1
						</Text>
					</Flex>
					<Flex
						mt={{ base: "1.8rem", "2xl": "0" }}
						// gap={{ base: "5px" }}
						// alignContent={{
						// 	base: "",
						// 	md: "center",
						// 	"2xl": "center",
						// }}
						direction="column"
					>
						<Text fontSize="0.8rem">Trained</Text>

						<Text fontSize={"0.9rem"} fontWeight={"bold"}>
							No
						</Text>
					</Flex>
					<Flex
						mt={{ base: "1.8rem", "2xl": "0" }}
						// gap={{ base: "5px" }}
						// alignContent={{
						// 	base: "",
						// 	md: "center",
						// 	"2xl": "center",
						// }}
						direction="column"
					>
						<Text fontSize="0.8rem">Training Date</Text>

						<Text fontSize={"0.9rem"} fontWeight={"bold"}>
							Not Available
						</Text>
					</Flex>
				</Box>
				<Flex
					alignItems="center"
					gap="1.5rem"
					mt="3.3rem"
					wrap="wrap"
					flexDirection={{
						base: "column",
						lg: "row",
						xl: "row",
						"2xl": "row",
					}}
				>
					<Box
						w={{
							base: "100%",
							md: "100%",
							lg: "20%",
							xl: "15%",
							"2xl": "10%",
						}}
					>
						<Buttons
							h="3.5rem"
							title="Submit"
							w={{
								base: "100%",
								md: "100%",
								lg: "8.75rem",
								xl: "8.75rem",

								"2xl": "8.75rem",
							}}
							fontSize="16px"
							// fontWeight="bold"
						/>
					</Box>
					<Button
						color="#11299E"
						fontSize=""
						fontWeight="bold"
						background={"none"}
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default PreviewSellerInfo;
