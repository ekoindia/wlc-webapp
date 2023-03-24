import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import { Buttons, Headings } from "components";
import Router from "next/router";

/**
 * A <PreviewSellerInfo> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<PreviewSellerInfo></PreviewSellerInfo>`
 */

const PreviewSellerInfo = ({ className = "", ...props }) => {
	return (
		<>
			<Headings title="Preview Seller Information" />
			<Flex
				direction={"column"}
				w="full"
				h={{ base: "auto", md: "700px" }}
				bg={{
					base: "none",

					lg: "white",
				}}
				borderRadius="10px"
				boxShadow={{
					base: "none",

					lg: "0px 5px 15px #0000000D",
				}}
				border={{
					base: "none",

					lg: "1px solid #D2D2D2",
				}}
				p={{
					base: "0px",

					lg: "20px",

					"2xl": "14px 30px 30px 30px",
				}}
				// mt={{ base: "0px", lg: "30px" }}

				//
			>
				<Box
					w={{
						base: "100%",

						lg: "97%",
						xl: "70vw",
						"2xl": "51vw",
					}}
					alignItems={{ base: "center", "2xl": "none" }}
				>
					<Flex
						direction={"column"}
						p={{ base: "10px", lg: "0px" }}
						borderBottom={{ base: "1px solid #D2D2D2", lg: "none" }}
						bg={"white"}
					>
						<Text
							as="h1"
							color="accent.DEFAULT"
							fontWeight="bold"
							fontSize={{ base: "lg", md: "2xl" }}
						>
							Angel Tech Private Limited
						</Text>
						<Text fontSize={{ base: "xs", md: "md" }}>
							Edit the fields below and click Preview.
							<Text
								as="span"
								display={{ base: "block", md: "inline" }}
							>
								{" "}
								Click Cancel to return to Client HomePage
								without submitting information.
							</Text>
						</Text>
					</Flex>
				</Box>
				<Flex display={{ base: "none", lg: "flex" }}>
					<Divider color="hint" mt="15px" />
				</Flex>
				<Flex
					bg="white"
					h="full"
					p={{
						base: "16px",
						md: "20px",
						lg: "0px",
					}}
					borderRadius={{ base: "10px", lg: "0" }}
					boxShadow={{
						base: "0px 5px 15px #0000000D",
						lg: "none",
					}}
					border={{
						base: " 1px solid #D2D2D2",
						lg: "none",
					}}
					mt={{ base: "16px", lg: "0px" }}
					mb={"20px"}
					mx={{ base: "16px", md: "0px" }}
					direction="column"
				>
					<Flex direction="column">
						<Box mt={{ base: "0px", md: "40px" }}>
							<Text
								fontSize={{ base: "1rem" }}
								fontWeight={{ base: "semibold" }}
							>
								Membership related information
							</Text>
						</Box>
						<Flex gap={{ base: "0", md: "12.5rem" }} mt="20px">
							<Flex
								display={{ base: "none", md: "flex" }}
								direction="column"
								gap="5px"
							>
								<Text fontSize="0.8rem">
									Network Assigned Manager
								</Text>

								<Text fontSize={"0.9rem"} fontWeight={"bold"}>
									Default ERO
								</Text>
							</Flex>

							<Flex direction="column">
								<Text fontSize="0.8rem">Created By</Text>

								<Text fontSize={"0.9rem"} fontWeight={"bold"}>
									Default ERO
								</Text>
							</Flex>
						</Flex>
						<Flex
							direction={{ base: "column", md: "row" }}
							gap={{ base: "", md: "17.8rem" }}
							mt={{ base: "20px", md: "40px" }}
						>
							<Flex direction="column">
								<Text fontSize="0.8rem">Parent</Text>

								<Text fontSize={"0.9rem"} fontWeight={"bold"}>
									Vijay Kumar
								</Text>
							</Flex>
							<Flex
								mt={{ base: "20px", "2xl": "0" }}
								direction="column"
							>
								<Text fontSize="0.8rem">External ID</Text>

								<Text fontSize={"0.9rem"} fontWeight={"bold"}>
									1
								</Text>
							</Flex>
						</Flex>
						<Flex
							direction={{ base: "column", md: "row" }}
							gap={{ base: "", md: "20rem" }}
							mt={{ base: "20px", md: "40px" }}
						>
							<Flex direction={"column"}>
								<Text fontSize="0.8rem">Trained</Text>

								<Text fontSize={"0.9rem"} fontWeight={"bold"}>
									No
								</Text>
							</Flex>
							<Flex
								mt={{ base: "20px", "2xl": "0" }}
								direction="column"
								display={{ base: "none", md: "flex" }}
							>
								<Text fontSize="0.8rem">Training ID</Text>

								<Text fontSize={"0.9rem"} fontWeight={"bold"}>
									N.A.
								</Text>
							</Flex>
						</Flex>
						<Flex
							mt={{ base: "20px", "2xl": "0" }}
							direction="column"
							display={{ base: "flex", md: "none" }}
						>
							<Text fontSize="0.8rem">Training Date</Text>

							<Text fontSize={"0.9rem"} fontWeight={"bold"}>
								Not Available
							</Text>
						</Flex>
					</Flex>

					<Flex
						alignItems="center"
						gap={{
							base: "2.1rem",
							md: "4.8rem",
							"2xl": "4.8rem",
						}}
						mt="4.2rem"
						justifyContent={"flex-start"}
						direction={{ base: "column", sm: "row" }}
					>
						<Buttons
							h="3.5rem"
							title="Save Now"
							fontSize="20px"
							fontWeight="bold"
							w={{
								base: "100%",
								sm: "10rem",
								md: "12.2rem",
							}}
						/>

						<Button
							onClick={() =>
								Router.push(
									"/admin/my-network/profile/up-sell-info/preview-sell-info"
								)
							}
							color={"accent.DEFAULT"}
							fontSize={"20px"}
							fontWeight="bold"
							bg="white"
							_focus={{
								bg: "white",
							}}
							_hover="none"
						>
							Cancel
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</>
	);
};

export default PreviewSellerInfo;
