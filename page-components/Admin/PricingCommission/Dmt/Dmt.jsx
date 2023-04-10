import {
	Box,
	Button,
	Flex,
	HStack,
	Input,
	Radio,
	RadioGroup,
	Select,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Buttons, Icon, InputLabel } from "components";
import { useRef, useState } from "react";

/**
 * A <Dmt> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Dmt></Dmt>`
 */

const Dmt = () => {
	const [value, setValue] = useState("0");
	const [iconValue, setIconValue] = useState("percent");

	const focusRef = useRef(null);

	const SelectData = [
		{ label: ["Select Products", "Select Slab"] },
		{ label: ["Select Individuals", "Select Slab"] },
		{ label: ["Select Distributors", "Select Slab"] },
	];
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
					<Text fontSize={"md"} fontWeight={"semibold"}>
						Select commissions for
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup
						w={"100%"}
						onChange={setValue}
						value={value}
						defaultValue="0"
					>
						<Stack
							direction={{ base: "column", md: "row" }}
							gap={{ base: "25px", sm: "20px", md: "20px" }}
							flexWrap={"wrap"}
						>
							<Radio size="lg" value="0">
								<Text fontSize={{ base: "sm", sm: "md" }}>
									Products
								</Text>
							</Radio>
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
						</Stack>
					</RadioGroup>
				</HStack>
			</VStack>

			{value ? (
				<>
					<Flex>
						<PriceSelect label={SelectData[+value].label[0]} />
					</Flex>

					<Flex>
						<PriceSelect label={SelectData[+value].label[1]} />
					</Flex>
				</>
			) : null}

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text fontSize={"md"} fontWeight={"semibold"}>
						Select Commission Type
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup
						w={"100%"}
						onChange={setIconValue}
						value={iconValue}
						defaultValue="0"
					>
						<Stack
							direction={{ base: "column", md: "row" }}
							gap={{ base: "5px", sm: "20px", md: "60px" }}
							flexWrap={"wrap"}
						>
							<Radio size="lg" value="percent">
								<Text fontSize={{ base: "xs", sm: "inherit" }}>
									Percentage (%)
								</Text>
							</Radio>

							<Radio size="lg" value="fixed">
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
					<Text fontSize={"md"} fontWeight={"semibold"}>
						Define Commission
					</Text>
				</Box>
				<HStack
					className="hstack"
					justifyContent={"flex-start"}
					w={"100%"}
					minH={{ base: "50px", md: "183px" }}
					direction={{ base: "column", md: "row" }}
				>
					<Flex
						h={"100%"}
						direction={{ base: "column", md: "row" }}
						columnGap="20px"
						w={{ base: "100%", xl: "71%", "2xl": "56.5%" }}
						mr={{ base: "0px", lg: "50px" }}
					>
						<Flex direction={"column"} rowGap={"4.375rem"}>
							<Flex
								w={{
									base: "100%",
									sm: "72%",
									md: "380px",
									xl: "400px",

									"2xl": "500px",
								}}
								h="3rem"
								border={"card"}
								borderRadius={{ base: "10px", xl: "10px" }}
								pr={"15px"}
								gap="15px"
								align="center"
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
									name={
										iconValue === "percent"
											? "percent_bg"
											: "rupee_bg"
									}
									w="23px"
									h="20px"
									color="accent.DEFAULT"
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
												color="accent.DEFAULT"
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
											color="accent.DEFAULT"
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
							position="relative"
							border="br-popupcard"
							boxShadow="0px 3px 6px #EFEFEF"
							w={{
								base: "100%",
								sm: "72%",
								md: "45%",
								xl: "42%",
							}}
							h={"180px"}
							borderRadius={{ base: "6px", sm: "10px" }}
							transition={"ease"}
							display={"none"}
							ref={focusRef}
						>
							<Box w={"100%"} h={"200px"}>
								<Box
									width={"15px"}
									height={"15px"}
									border="br-popupcard"
									borderRight="none"
									borderRadius="2px"
									transform={"rotate(45deg)"}
									mt={{ base: "-4px", md: "15px" }}
									ml={{ base: "25px", md: "-4px" }}
									bg="focusbg"
								></Box>

								<Box
									top={"0%"}
									bg="focusbg"
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
									<Flex
										w={"100%"}
										h={{ base: "auto", sm: "30px" }}
										color={"white"}
										bg={"primary.DEFAULT"}
										borderRadius={"6px"}
										justify={"space-between"}
										px={{ base: "12px", sm: "15px" }}
										py={{ base: "7px", sm: "8px" }}
										flexDir={{ base: "column", sm: "row" }}
										align={{ base: "", sm: "row" }}
									>
										<Text
											fontSize={"12px"}
											lineHeight="normal"
										>
											Benchmark Transaction
										</Text>
										<Flex
											align={"center"}
											columnGap={"5px"}
										>
											<Icon
												name="rupee"
												w="9px"
												h="11px"
											/>
											<Text fontSize={"12px"}>
												5000.00
											</Text>
										</Flex>
									</Flex>
									<Flex
										w={"100%"}
										h={"calc( 100% - 30px)"}
										p={"7px"}
										py={"14px"}
										direction={"column"}
										gap={{ base: "15px", sm: "25px" }}
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
													<Icon
														name="rupee"
														w="9px"
														h="11px"
													/>

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
													<Icon
														name="rupee"
														w="9px"
														h="11px"
													/>

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
													<Icon
														name="rupee"
														w="9px"
														h="11px"
													/>

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
													<Icon
														name="rupee"
														w="9px"
														h="11px"
													/>
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

const PriceSelect = ({
	label,
	required = false,
	/* labelStyle, */
	inputContStyle,
	/* ...props */
}) => {
	// const [values, setValues] = useState(0);
	return (
		<Flex direction={"column"} w="100%">
			<Flex>
				{label ? (
					<InputLabel
						required={required}
						fontSize="md"
						color="inputlabel"
						// pl: "0",
						fontWeight="600"
						mb={{ base: 2.5, "2xl": "0.8rem" }}
					>
						{label}
					</InputLabel>
				) : null}
			</Flex>

			<Flex
				justifyContent={{ base: "center", sm: "flex-start" }}
				w={{
					base: "100%",
					sm: "72%",
					md: "380px",
					xl: "400px",
					"2xl": "500px",
				}}
			>
				<Select
					placeholder="-- Select --"
					w="100%"
					h="3rem"
					fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
					focusBorderColor={"#D2D2D2"}
					_focus={{
						border: "1px solid #D2D2D2",
						boxShadow: "none",
					}}
					borderRadius="10px"
					icon={<Icon name="caret-down" w="14px" h="10px" />}
					{...inputContStyle}
				>
					<option value="option1">Option 1</option>
					<option value="option2">Option 2</option>
					<option value="option3">Option 3</option>
				</Select>
			</Flex>
		</Flex>
	);
};
