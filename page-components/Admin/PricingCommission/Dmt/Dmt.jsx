import {
	Box,
	Flex,
	HStack,
	Input,
	Radio,
	RadioGroup,
	Select,
	Stack,
	MenuButton,
	Text,
	VStack,
	Button,
} from "@chakra-ui/react";
import { Buttons, Icon } from "components";
import React, { useRef } from "react";

/**
 * A <Dmt> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Dmt></Dmt>`
 */

const Dmt = ({ className = "", ...props }) => {
	const focusRef = useRef(null);

	const popBoxHandle = (boxStateFlag) => {
		if (boxStateFlag) {
			focusRef.current.style.display = "block";
		} else {
			focusRef.current.style.display = "none	";
		}
	};

	return (
		<Stack w={"100%"} minH={{ base: "100%", md: "100%" }} gap={"10"}>
			<VStack w={"100%"} gap={".5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{
							base: "sm",
							md: "md",
							lg: "md",
							xl: "md",
							"2xl": "lg",
						}}
						fontWeight={"semibold"}
					>
						Select commissions for
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup w={"100%"}>
						<Stack
							direction={{ base: "column", md: "row" }}
							gap={{ base: "25px", sm: "20px", md: "20px" }}
							flexWrap={"wrap"}
						>
							<Radio size="lg" value="1">
								<Text fontSize={{ base: "sm", sm: "md" }}>
									Individuals
								</Text>
							</Radio>

							<Radio size="lg" value="2">
								<Text fontSize={{ base: "sm", sm: "md" }}>
									Distributors
								</Text>
							</Radio>
							<Radio size="lg" value="3">
								<Text fontSize={{ base: "sm", sm: "md" }}>
									Products
								</Text>
							</Radio>
						</Stack>
					</RadioGroup>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Select Distributors
					</Text>
				</Box>
				<HStack
					justifyContent={{ base: "center", sm: "flex-start" }}
					w={"100%"}
				>
					<Select
						placeholder="-- Select --"
						w={{
							base: "100%",
							sm: "72%",
							md: "380px",

							"2xl": "500px",
						}}
						h={{
							base: "48px",
							sm: "45px",
							md: "48px",
						}}
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						focusBorderColor={"#D2D2D2"}
						_focus={{
							border: "1px solid #D2D2D2",
							boxShadow: "none",
						}}
						borderRadius="10px"
						icon={<Icon name="caret-down" />}
					>
						<option value="option1">Option 1</option>
						<option value="option2">Option 2</option>
						<option value="option3">Option 3</option>
					</Select>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Select Slab
					</Text>
				</Box>
				<HStack
					justifyContent={{ base: "center", sm: "flex-start" }}
					w={"100%"}
				>
					<Select
						placeholder="-- Select --"
						w={{
							base: "100%",
							sm: "72%",
							md: "380px",

							"2xl": "500px",
						}}
						h={{
							base: "48px",
							sm: "45px",
							md: "48px",

							"2xl": "48px",
						}}
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						focusBorderColor={"#D2D2D2"}
						_focus={{
							border: "1px solid #D2D2D2",
							boxShadow: "none",
						}}
						borderRadius="10px"
						icon={<Icon name="caret-down" />}
					>
						<option value="option1">Option 1</option>
						<option value="option2">Option 2</option>
						<option value="option3">Option 3</option>
					</Select>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{
							base: "sm",
							md: "sm",
							lg: "sm",
							xl: "sm",
							"2xl": "lg",
						}}
						fontWeight={"semibold"}
					>
						Select Commission Type
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup w={"100%"}>
						<Stack
							direction={{ base: "column", md: "row" }}
							gap={{ base: "5px", sm: "20px", md: "60px" }}
							flexWrap={"wrap"}
						>
							<Radio size="lg" value="1">
								<Text fontSize={{ base: "xs", sm: "inherit" }}>
									Percentage (%)
								</Text>
							</Radio>

							<Radio size="lg" value="2">
								<Text fontSize={{ base: "xs", sm: "inherit" }}>
									Fixed
								</Text>
							</Radio>
						</Stack>
					</RadioGroup>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"} h={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Define Commission
					</Text>
				</Box>
				<HStack
					justifyContent={"flex-start"}
					w={"100%"}
					minH={{ base: "50px", md: "183px" }}
					direction={{ base: "column", md: "row" }}
				>
					<Flex
						h={"100%"}
						direction={{ base: "column", md: "row" }}
						justifyContent={"space-between"}
						// w="auto"
						w={{ base: "100%", xl: "71%", "2xl": "56.5%" }}
						mr={{ base: "0px", lg: "50px" }}
					>
						<Flex direction={"column"} rowGap={"4.375rem"}>
							<Flex
								w={{
									base: "100%",
									sm: "72%",
									md: "380px",
									// lg: "300px",
									// xl: "380px",
									"2xl": "500px",
								}}
								h={{
									base: "48px",
									sm: "45px",
									md: "48px",
									// lg: "36px",
									// xl: "37px",
									"2xl": "50px",
								}}
								border={"card"}
								borderRadius={{ base: "10px", xl: "10px" }}
								pr={"15px"}
								gap="15px"
							>
								<Input
									placeholder="Commission Percentage"
									defaultValue={"2.5"}
									type={"number"}
									w={{ base: "100%" }}
									h={"48px"}
									border={"none"}
									min={"0"}
									focusBorderColor={"transparent"}
									fontSize={{
										base: "sm",
										md: "sm",
										"2xl": "lg",
									}}
									onClick={() => {
										popBoxHandle(true);
									}}
									onBlur={() => {
										popBoxHandle(false);
									}}
								/>
								<Icon
									name="rupee_bg"
									width="23px"
									h="20px"
									color={"#11299E"}
								/>
							</Flex>

							<Flex
								position={{ base: "fixed", md: "initial" }}
								w={"100%"}
								// h={"83px"}
								bottom={"0%"}
								left={"0%"}
								zIndex={"99"}
								boxShadow={{
									base: "0px -3px 10px #0000001A",
									md: "none",
									bg: "white",
								}}
							>
								<Flex
									gap={{ base: "5", md: "3.375rem" }}
									align={"center"}
									display={{ base: "none", md: "flex" }}
								>
									<Buttons
										w={{
											base: "100%",
											sm: "150px",
											md: "200px",
											lg: "210px",

											"2xl": "249px",
										}}
										h={{
											base: "40px",
											sm: "40px",
											md: "64px",
										}}
										fontSize={{
											base: "xs",
											md: "lg",
										}}
										borderRadius={{
											base: "5px",
											md: "10px",
										}}
										title="Save Commissions"
										fontWeight={"bold"}
										boxShadow="0px 3px 10px #FE9F0040"
									/>
									<Buttons
										fontSize={{
											base: "xs",
											md: "lg",
										}}
										borderRadius={{
											base: "5px",
											xl: "10px",
										}}
										title="Cancel"
										variant={"link"}
										color={"accent.DEFAULT"}
										fontWeight={"bold"}
									/>
								</Flex>

								<Flex
									display={{ base: "flex", md: "none" }}
									mt="20px"
								>
									<Flex
										display={{ md: "none" }}
										w={"100%"}
										overflow={"hidden"}
										h={"100%"}
									>
										<Button
											as={Button}
											// aria-label="Options"
											w={"50vw"}
											bg="white"
											h={"63px"}
											borderRadius={"0px"}
											color="accent.DEFAULT"
											_active={{
												bg: "white",
											}}
											_hover={{
												bg: "white",
											}}
										>
											<Text
												color="#11299E"
												fontSize={"20px"}
												lineHeight={"0"}
												fontWeight={"semibold"}
												display={"flex"}
												justifyContent={"center"}
												alignItems={"center"}
												// gap={"10px"}
											>
												Cancel
											</Text>
										</Button>
									</Flex>
									<Flex>
										<Button
											display={"flex"}
											gap={"10px"}
											// ref={btnRef}
											// onClick={onOpen}
											w={"50vw"}
											h={"63px"}
											bg="primary.DEFAULT"
											color="#11299E"
											borderRadius={"0px"}
											boxShadow=" 0px 3px 10px #11299E1A"
											_active={{
												bg: "primary.DEFAULT",
											}}
											_hover={{
												bg: "primary.DEFAULT",
											}}
										>
											<Text
												as="span"
												color="white"
												fontSize={"18px"}
												lineHeight={"5"}
												fontWeight={"semibold"}
											>
												Save
												<br /> Commissions
											</Text>
										</Button>
									</Flex>
								</Flex>
							</Flex>
						</Flex>

						<Box
							mt={{ base: "10px", md: "0" }}
							position={"relative"}
							// bg={"#FFFBF3"}
							border={"1px solid #FE9F00"}
							w={{ base: "80vw", sm: "72%", md: "45%", xl: "sm" }}
							h={"180px"}
							borderRadius={"10px"}
							transition={"ease"}
							display={"none"}
							ref={focusRef}
						>
							<Box w={"100%"} h={"200px"}>
								<Box
									width={"15px"}
									height={"15px"}
									borderBottom={"1px solid #FE9F00"}
									borderLeft={"1px solid #FE9F00"}
									borderTop={"1px solid #FE9F00"}
									borderRadius={"2px"}
									transform={"rotate(45deg)"}
									mt={{ base: "-4px", md: "15px" }}
									ml={{ base: "25px", md: "-4px" }}
									bg={"#FFFBF3"}
								></Box>

								<Box
									top={"0%"}
									bg={"#FFFBF3"}
									borderRadius={"10px"}
									left={"0%"}
									width={{
										base: "100%",
										sm: "100%",
										md: "100%",
									}}
									h={"100%"}
									position={"absolute"}
									px={"11px"}
									py={"10px"}
								>
									<HStack
										justify={"space-between"}
										color={"white"}
										borderRadius={"6px"}
										h={"31px"}
										w={"100%"}
										bg={"primary.DEFAULT"}
										px={"15px"}
										py={"8px"}
									>
										<Text fontSize={"12px"}>
											Benchmark Transaction
										</Text>
										<Flex align={"center"} gap={"5px"}>
											<Box width="7px" height="9px">
												<Icon name="rupee" />
											</Box>
											<Text fontSize={"12px"}>
												5000.00
											</Text>
										</Flex>
									</HStack>
									<Flex
										w={"100%"}
										h={"calc( 100% - 31px)"}
										p={"7px"}
										py={"14px"}
										direction={"column"}
										gap={"25px"}
									>
										<Flex w={"100%"}>
											<Flex
												direction={"column"}
												width={"50%"}
												h={"50%"}
											>
												<Text
													fontSize={"12px"}
													color="#0F0F0F"
												>
													Fixed charges
												</Text>
												<Flex
													w={"100%"}
													gap={"5px"}
													align={"center"}
												>
													<Box
														width={"8px"}
														height={"9px"}
													>
														<Icon name="rupee" />
													</Box>
													<Text
														fontSize={"14px"}
														fontWeight={"semibold"}
													>
														1.80
													</Text>
												</Flex>
											</Flex>

											<Flex
												direction={"column"}
												width={"50%"}
												h={"50%"}
											>
												<Text fontSize={"12px"}>
													Taxes
												</Text>
												<Flex
													w={"100%"}
													gap={"5px"}
													align={"center"}
												>
													<Box
														width={"8px"}
														height={"9px"}
													>
														<Icon name="rupee" />
													</Box>
													<Text
														fontSize={"14px"}
														fontWeight={"semibold"}
													>
														0.80
													</Text>
												</Flex>
											</Flex>
										</Flex>
										<Flex w={"100%"}>
											<Flex
												direction={"column"}
												width={"50%"}
												h={"50%"}
											>
												<Text
													fontSize={"12px"}
													color="#0F0F0F"
												>
													Fixed charges
												</Text>
												<Flex
													w={"100%"}
													gap={"5px"}
													align={"center"}
												>
													<Box
														width={"8px"}
														height={"9px"}
													>
														<Icon name="rupee" />
													</Box>
													<Text
														fontSize={"14px"}
														fontWeight={"semibold"}
													>
														1.80
													</Text>
												</Flex>
											</Flex>

											<Flex
												direction={"column"}
												width={"50%"}
												h={"50%"}
											>
												<Text fontSize={"12px"}>
													Taxes
												</Text>
												<Flex
													w={"100%"}
													gap={"5px"}
													align={"center"}
												>
													<Box
														width={"8px"}
														height={"9px"}
													>
														<Icon name="rupee" />
													</Box>
													<Text
														fontSize={"14px"}
														fontWeight={"semibold"}
													>
														0.80
													</Text>
												</Flex>
											</Flex>
										</Flex>
									</Flex>
								</Box>
							</Box>
						</Box>
					</Flex>
				</HStack>
			</VStack>
		</Stack>
	);
};

export default Dmt;
