import React from "react";
import { Flex, Box, Heading, Text, Button } from "@chakra-ui/react";
import { Buttons } from "../../..";

/**
 * A <PreviewPersonalInfo> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<PreviewPersonalInfo></PreviewPersonalInfo>`
 */
const PreviewSellerInfo = ({ className = "", ...props }) => {
	return (
		<Flex
			w={{ base: "100%", "2xl": "80.5vw" }}
			h={{ base: "full", "2xl": "51vw" }}
			// m="20px"
			// bg="red"

			direction="column"
		>
			<Flex
				bg={{ base: "#FFFFFF", "2xl": "white" }}
				w={{ base: "100%", md: "83vw", "2xl": "51vw" }}
				// h={{base:"35vw"}}
				m={{ base: "0px", md: "0px", "2xl": "1.875em" }}
				// alignItems={{ base: "center", "2xl": "none" }}
				border={{ base: "0px" }}
				direction={"column"}
				p={{ base: "0 0 0 0.6rem" }}
			>
				<Heading
					// fontSize={"1.5em"}
					fontSize={{ base: "1.2em", "2xl": "1.5em" }}
					color={"#11299E"}
					// mt={"24px"}
					fontWeight="semibold"
					m={{ base: "5px", "2xl": "0px" }}
				>
					Angel Tech Private Limited
				</Heading>
				<Text
					fontSize={{ base: "0.9em", "2xl": "1em" }}
					mt={"0.4rem"}
					m={{ base: "0px 0px 0px 5px", "2xl": "0px" }}
					color="#0F0F0F"
				>
					Edit the fields below and click Preview. Click Cancel to
					return to Client HomePage without submitting information.
				</Text>
			</Flex>

			<Flex
				w={{ base: "90vw", "2xl": "" }}
				h={{ base: "full" }}
				m={{ base: "1rem" }}
				bg="white"
				boxShadow={{ base: "box-shadow: 0px 5px 15px #0000000D;" }}
				border={{ base: "1px solid #D2D2D2" }}
				borderRadius={{ base: "10px" }}
				direction="column"
			>
				<Box p={{ base: "1rem" }}>
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
						gap={{ base: "px" }}
						alignContent={{
							base: "",
							md: "center",
							"2xl": "center",
						}}
						direction="column"
					>
						<Text fontSize="0.8rem">Created By</Text>

						<Text fontSize={"0.9rem"} fontWeight={"bold"}>
							Default ERO
						</Text>
					</Flex>
					<Flex
						mt={{ base: "1.8rem", "2xl": "0" }}
						gap={{ base: "5px" }}
						alignContent={{
							base: "",
							md: "center",
							"2xl": "center",
						}}
						direction="column"
					>
						<Text fontSize="0.8rem">Parent</Text>

						<Text fontSize={"0.9rem"} fontWeight={"bold"}>
							Vijay Kumar
						</Text>
					</Flex>
					<Flex
						mt={{ base: "1.8rem", "2xl": "0" }}
						gap={{ base: "5px" }}
						alignContent={{
							base: "",
							md: "center",
							"2xl": "center",
						}}
						direction="column"
					>
						<Text fontSize="0.8rem">External id</Text>

						<Text fontSize={"0.9rem"} fontWeight={"bold"}>
							1
						</Text>
					</Flex>
					<Flex
						mt={{ base: "1.8rem", "2xl": "0" }}
						gap={{ base: "5px" }}
						alignContent={{
							base: "",
							md: "center",
							"2xl": "center",
						}}
						direction="column"
					>
						<Text fontSize="0.8rem">Trained</Text>

						<Text fontSize={"0.9rem"} fontWeight={"bold"}>
							No
						</Text>
					</Flex>
					<Flex
						mt={{ base: "1.8rem", "2xl": "0" }}
						gap={{ base: "5px" }}
						alignContent={{
							base: "",
							md: "center",
							"2xl": "center",
						}}
						direction="column"
					>
						<Text fontSize="0.8rem">Training Date</Text>

						<Text fontSize={"0.9rem"} fontWeight={"bold"}>
							Not Available
						</Text>
					</Flex>
				</Box>
				<Flex
					justifyContent={"center"}
					gap={{ base: "2.1rem", "2xl": "3.8rem" }}
					mt="3rem"
					wrap="wrap"
				>
					<Box>
						<Buttons
							h="3.5rem"
							title="Submit"
							w={{
								base: "80vw",
								sm: "8.75rem",
								"2xl": "8.75rem",
							}}
						/>
					</Box>
					<Button
						color="#11299E"
						fontSize={"1.2rem"}
						fontWeight="semibold"
						background={"none"}
						ml={{ base: "0px", "2xl": "0" }}
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default PreviewSellerInfo;
